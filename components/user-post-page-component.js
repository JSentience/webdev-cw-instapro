import { dislikePost, getUserPosts, likePost } from '../api.js';
import { posts, renderApp, updatePosts, user } from '../index.js';

export const renderUserPostPage = ({ appEl, userId }) => {
  const currentUserPosts = posts.filter((post) => {
    return post && post.user && post.user.id === userId;
  });

  const userPostHtml =
    currentUserPosts.length > 0
      ? currentUserPosts
          .map((post) => {
            const isLiked = post.isLiked;
            const likesCount = post.likes.length;
            const lastLiker =
              likesCount > 0 ? post.likes[likesCount - 1].name : null;
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

            return `
      <li class="post">
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
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${result}
                    </p>
                  </li>`;
          })
          .join('')
      : `<li><p>Нет постов</p></li>`;

  const userHeaderHtml =
    currentUserPosts.length > 0
      ? `<div class="posts-user-header">
       <img src="${currentUserPosts[0].user.imageUrl}" class="posts-user-header__user-image">
       <p class="posts-user-header__user-name">${currentUserPosts[0].user.name}</p>
     </div>`
      : '';

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      ${userHeaderHtml}
      <ul class="posts">
    
        ${userPostHtml}
      </ul>
    </div>
  `;

  for (let likeButton of document.querySelectorAll('.like-button')) {
    likeButton.addEventListener('click', () => {
      const postId = likeButton.dataset.postId;
      const isLiked = likeButton.dataset.liked === 'true';
      const token = `Bearer ${user.token}`;

      if (isLiked) {
        dislikePost({ postId, token })
          .then(() => {
            return getUserPosts({ token, userId });
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
            return getUserPosts({ token, userId });
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
};
