// noinspection D

import { getPosts, getUserPosts } from './api.js';
import { renderAddPostPageComponent } from './components/add-post-page-component.js';
import { renderAuthPageComponent } from './components/auth-page-component.js';
import { renderHeaderComponent } from './components/header-component.js';
import { renderLoadingPageComponent } from './components/loading-page-component.js';
import { renderPostsPageComponent } from './components/posts-page-component.js';
import { renderUserPostPage } from './components/user-post-page-component.js';
import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
} from './helpers.js';
import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes.js';

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];
export let pageData = null;

export const updatePosts = (newPosts) => {
  posts = newPosts;
};

const getToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined;
    return token;
};

export const logout = () => {
    user = null;
    removeUserFromLocalStorage();
    goToPage(POSTS_PAGE);
};

/**
 * Включает страницу приложения
 */
export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage)
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            /* Если пользователь не авторизован, то отправляем его на страницу авторизации перед добавлением поста */
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
            return renderApp();
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE;
            renderApp();

            return getPosts({ token: getToken() })
                .then((newPosts) => {
                    page = POSTS_PAGE;
                    posts = newPosts;
                    renderApp();
                })
                .catch((error) => {
                    console.error(error);
                    goToPage(POSTS_PAGE);
                });
        }

        if (newPage === USER_POSTS_PAGE) {
            // @@TODO: реализовать получение постов юзера из API
            page = LOADING_PAGE;
            renderApp();

            return getUserPosts({ userId: data.userId, token: getToken() })
                .then((response) => {
                    page = USER_POSTS_PAGE;
                    pageData = data;
                    // Проверяем структуру ответа - возможно, посты находятся в свойстве posts
                    posts = response.posts || response;
                    renderApp();
                })
                .catch((error) => {
                    console.error(error);
                    goToPage(POSTS_PAGE);
                });
        }

        page = newPage;
        renderApp();

        return;
    }

    throw new Error('страницы не существует');
};

export const renderApp = () => {
    const appEl = document.getElementById('app');
    if (page === LOADING_PAGE) {
        renderLoadingPageComponent({
            appEl,
            user,
            goToPage,
        });
    }

    if (page === AUTH_PAGE) {
        renderAuthPageComponent({
            appEl,
            setUser: (newUser) => {
                user = newUser;
                saveUserToLocalStorage(user);
                goToPage(POSTS_PAGE);
            },
            user,
            goToPage,
        });
    }

    if (page === ADD_POSTS_PAGE) {
        renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
                // @TODO: реализовать добавление поста в API
                console.log('Добавляю пост...', { description, imageUrl });
                goToPage(POSTS_PAGE);
            },
        });
    }

    if (page === POSTS_PAGE) {
        renderPostsPageComponent({
            appEl,
        });
    }

    if (page === USER_POSTS_PAGE) {
        renderUserPostPage({
            appEl,
            userId: pageData.userId,
            posts,
        });
    }
    const headerContainer = document.querySelector('.header-container');
    if (headerContainer) {
        renderHeaderComponent({ element: headerContainer });
    }
};

goToPage(POSTS_PAGE);
