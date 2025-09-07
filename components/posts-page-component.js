import {goToPage, posts, user} from "../index.js"
import {POSTS_PAGE, USER_POSTS_PAGE} from "../routes.js"
import {renderHeaderComponent} from "./header-component.js"
import {dislikePost, likePost} from "../api.js";


export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
	
	const postHtml = posts.map(post => {
    const isLiked = post.isLiked;
    const likesCount = post.likes.length;
    const likesText = likesCount === 0 ? "Нравится: 0" : `Нравится: <strong>${likesCount}</strong>`;

    const { formatDistanceToNow } = dateFns;
    const result = formatDistanceToNow(post.createdAt, {
      addSuffix: true,
      locale: dateFns.locale.ru
    });
		// noinspection HtmlRequiredAltAttribute
    return `
			<li class="post">
                    <div class="post-header" data-user-id="${post.user.id}">
                        <img src="${post.user.imageUrl}" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                    <button data-post-id="${post.id}" data-liked="${isLiked}" class="like-button">
                    <img src="${isLiked ? './assets/images/like-active.svg' : './assets/images/like-not-active.svg'}">
                    </button>
                    <p class="post-likes-text">${likesText}</p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                      ${post.description}
                    </p>
                    <p class="post-date">
                      ${result}
                    </p>
                  </li>`
	}).join("");
  console.log("Актуальный список постов:", posts);

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

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  for (let likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", () => {
      const postId = likeButton.dataset.postId;
      const isLiked = likeButton.dataset.liked === "true";
      const token = `Bearer ${user.token}`;

      if (isLiked) {
        dislikePost({ postId, token })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error("Ошибка дизлайка:", error);
          });
      } else {
        likePost({ postId, token })
          .then(() => {
            goToPage(POSTS_PAGE);
          })
          .catch((error) => {
            console.error("Ошибка лайка:", error);
          });
      }
    });
  }
}
