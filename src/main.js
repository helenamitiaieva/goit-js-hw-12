import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showMainLoader,
  hideMainLoader,
  showLoadMoreLoader,
  hideLoadMoreLoader,
  showLoadMoreButton,
  hideLoadMoreButton
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const perPage = 15;
let totalAvailableImages = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();
  currentQuery = form.elements['search-text'].value.trim();
  currentPage = 1;

  if (!currentQuery) {
    iziToast.warning({
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  hideLoadMoreButton(loadMoreBtn);
  showMainLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(currentQuery, currentPage, perPage);
    totalAvailableImages = totalHits;

    if (!hits.length) {
      iziToast.info({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
      });
      return;
    }

    createGallery(hits);

    if (totalHits > perPage) {
      showLoadMoreButton(loadMoreBtn);
    } else {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      message: 'Something went wrong. Please try again.',
      position: 'topRight',
    });
  } finally {
    hideMainLoader();
  }
}

async function onLoadMore() {
  currentPage += 1;
  showLoadMoreLoader();

  try {
    const { hits } = await getImagesByQuery(currentQuery, currentPage, perPage);
    createGallery(hits);

    const alreadyLoaded = currentPage * perPage;
    if (alreadyLoaded >= totalAvailableImages) {
      hideLoadMoreButton(loadMoreBtn);
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    const cardHeight = galleryItems[0].getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

  } catch (error) {
    iziToast.error({
      message: 'Something went wrong while loading more.',
      position: 'topRight',
    });
  } finally {
    hideLoadMoreLoader();
  }
}