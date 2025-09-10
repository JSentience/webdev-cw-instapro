import { goToPage, posts } from "../index.js"
import { USER_POSTS_PAGE } from "../routes.js"

export const renderUserPostPage = (appEl,)=>{
  console.log("posts in user page:", posts);
  const userPostHtml = posts.map(
      (post) => {
        const isLiked = post.isLiked;
        const likesCount = post.likes.length;
        const likesText = likesCount === 0
          ? "Нравится: 0"
          : `Нравится: <strong>${likesCount}</strong>`;

        const { formatDistanceToNow } = dateFns;
        const result = formatDistanceToNow(post.createdAt, {
          addSuffix: true,
          locale: dateFns.locale.ru
        });
        
       return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
          <img src="${post.user.imageUrl}" class="post-user-image" />
          <p class="post-user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" />
        </div>
        <p class="post-description">
          <span class="post-author">${post.user.name}</span>
          ${post.description}
        </p>
        <div class="post-footer">
          <button class="like-button">
            <img 
              src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"}" 
              class="like-icon" 
            />
          </button>
          <span class="likes-counter">${post.likes.length}</span>
        </div>
      </li>
    `
      })
    .join("");

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${userPostHtml}
      </ul>
    </div>
  `;

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, { userId: userEl.dataset.userId });
    });
  }

};