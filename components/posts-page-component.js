// noinspection D

import { dislikePost, getPosts, likePost } from '../api.js';
import { secureHtml } from '../helpers.js';
import { goToPage, posts, renderApp, updatePosts, user } from '../index.js';
import { USER_POSTS_PAGE } from '../routes.js';

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  const postHtml = posts
    .map((post) => {
      const isLiked = post.isLiked;
      const likesCount = post.likes.length;
      const lastLiker = likesCount > 0 ? secureHtml(post.likes[likesCount - 1].name) : null;
      const likesText =
        likesCount === 0
          ? 'Нравится: 0'
          : likesCount === 1
            ? lastLiker
            : `${lastLiker} и еще ${likesCount - 1}`;

      const { formatDistanceToNow } = dateFns;
      const result = formatDistanceToNow(post.createdAt, {
        addSuffix: true,
        locale: dateFns.locale.ru,
      });
      // noinspection HtmlRequiredAltAttribute
      return `
			<li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                    <button data-post-id="${
                      post.id
                    }" data-liked="${isLiked}" class="like-button">
                    <img src="${
                      isLiked
                        ? './assets/images/like-active.svg'
                        : './assets/images/like-not-active.svg'
                    }">
                    </button>
                    <p class="post-likes-text">${likesText}</p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${secureHtml(post.user.name)}</span>
                      ${secureHtml(post.description)}
                    </p>
                    <p class="post-date">
                      ${result}
                    </p>
                  </li>`;
    })
    .join('');

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">                  
									${postHtml}
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  for (let userEl of document.querySelectorAll('.post-header')) {
    userEl.addEventListener('click', () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  for (let likeButton of document.querySelectorAll('.like-button')) {
    likeButton.addEventListener('click', () => {
      const postId = likeButton.dataset.postId;
      const isLiked = likeButton.dataset.liked === 'true';
      const token = `Bearer ${user.token}`;

      // Добавление анимации лайка
      likeButton.classList.add('animate');
      setTimeout(() => {
        likeButton.classList.remove('animate');
      }, 800);

      if (isLiked) {
        dislikePost({ postId, token })
          .then(() => {
            return getPosts({ token });
          })
          .then((response) => {
            updatePosts(response.posts || response);
            renderApp();
          })
          .catch((error) => {
            console.error('Ошибка дизлайка:', error);
          });
      } else {
        likePost({ postId, token })
          .then(() => {
            return getPosts({ token });
          })
          .then((response) => {
            updatePosts(response.posts || response);
            renderApp();
          })
          .catch((error) => {
            console.error('Ошибка лайка:', error);
          });
      }
    });
  }
}
