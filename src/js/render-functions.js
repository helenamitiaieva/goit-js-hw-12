import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
const mainLoader = document.querySelector('.main-loader');
const loadMoreLoader = document.querySelector('.load-more-loader');

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

export function createGallery(images) {
  const markup = images.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => `
    <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <div class="info">
        <p><b>Likes:</b> ${likes}</p>
        <p><b>Views:</b> ${views}</p>
        <p><b>Comments:</b> ${comments}</p>
        <p><b>Downloads:</b> ${downloads}</p>
      </div>
    </li>
  `
  ).join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showMainLoader() {
  mainLoader.classList.remove('is-hidden');
}
export function hideMainLoader() {
  mainLoader.classList.add('is-hidden');
}

export function showLoadMoreLoader() {
  loadMoreLoader.classList.remove('is-hidden');
}
export function hideLoadMoreLoader() {
  loadMoreLoader.classList.add('is-hidden');
}

export function showLoadMoreButton(loadMoreBtn) {
  if (loadMoreBtn) loadMoreBtn.parentElement.classList.remove('is-hidden');
}
export function hideLoadMoreButton(loadMoreBtn) {
  if (loadMoreBtn) loadMoreBtn.parentElement.classList.add('is-hidden');
}