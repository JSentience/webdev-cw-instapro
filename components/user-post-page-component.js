import {goToPage} from "../index.js";
import {USER_POSTS_PAGE} from "../routes.js";


export const renderUserPostPage = (appEl, posts)=>{
  const userPostHtml  = posts.map((post) => {
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
                  </li>
    `
  }).join('')

  appEl.innerHTML = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${userPostHtml}
      </ul>
    </div>
  `;

  appEl.querySelectorAll('.post-header').forEach(userEl => {
    userEl.addEventListener('click', () => {
      const userId = userEl.dataset.userId;
      goToPage(USER_POSTS_PAGE, { userId })
    })});

};