import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreContainer = document.querySelector('.load-more-container');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let currentPage = 1;
const perPage = 15;
let totalAvailableImages = 0;

form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

function showLoadMore() {
  loadMoreContainer.classList.remove('is-hidden');
}

function hideLoadMore() {
  loadMoreContainer.classList.add('is-hidden');
}

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
    hideLoadMore();
    showLoader();
  
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
  
      if (hits.length < totalAvailableImages) {
        showLoadMore();
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
      hideLoader();
    }
  }

async function onLoadMore() {
    currentPage += 1;
    showLoader();
  
    try {
      const { hits } = await getImagesByQuery(currentQuery, currentPage, perPage);
      createGallery(hits);
  
      const galleryItems = document.querySelectorAll('.gallery-item');
      const lastItem = galleryItems[galleryItems.length - hits.length]; 
      if (lastItem) {
        const cardHeight = lastItem.getBoundingClientRect().height;
        window.scrollBy({
          top: cardHeight * 2,
          behavior: 'smooth',
        });
      }
  
      const alreadyLoaded = currentPage * perPage;
      if (alreadyLoaded >= totalAvailableImages) {
        hideLoadMore();
        iziToast.info({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
        });
      }
    } catch (error) {
      iziToast.error({
        message: 'Something went wrong while loading more.',
        position: 'topRight',
      });
    } finally {
      hideLoader();
    }
  }