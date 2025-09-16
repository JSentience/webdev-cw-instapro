import { addPost } from "../api.js"
import { user } from "../index.js"
import { renderHeaderComponent } from "./header-component.js"
import { renderUploadImageComponent } from "./upload-image-component.js"
import { goToPage } from "../index.js"
import { POSTS_PAGE } from "../routes.js"

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = '';
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
  <div class="page-container">
    <div class="header-container"></div>
    <div class="form">
      <h3 class="form-title">Добавить пост</h3>
      <div class="form-inputs">
        <div class="upload-image-container"></div>
        <textarea class="input textarea" rows="4" placeholder="Описание поста"></textarea>
        <button class="button" id="add-button">Добавить</button>
      </div>
    </div>
  </div>`;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector('.upload-image-container');
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange: (newImageUrl) => {
        imageUrl = newImageUrl;
      },
    });

    const description = appEl.querySelector('.textarea');
    document.getElementById("add-button").addEventListener("click", () => {
      if (!imageUrl) {
        alert("Необходимо загрузить изображение");
        return;
      }

      if (!description.value.trim()) {
        alert("Необходимо добавить описание");
        return;
      }

      // Блокируем кнопку во время отправки
      const addButton = document.getElementById("add-button");
      addButton.disabled = true;
      addButton.textContent = "Добавление...";

      // Вызываем API функцию добавления поста
      addPost({
        description: description.value,
        imageUrl: imageUrl,
        token: user ? `Bearer ${user.token}` : ''
      })
        .then(() => {
          // После успешного добавления переходим на страницу постов
          goToPage(POSTS_PAGE);
        })
        .catch((error) => {
          console.error("Ошибка добавления поста:", error);
          alert("Не удалось добавить пост: " + error.message);
        })
        .finally(() => {
          addButton.disabled = false;
          addButton.textContent = "Добавить";
        });
    });
		 
  };

  render();
}
