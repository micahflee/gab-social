import api, { getLinks } from '../api';
import { importFetchedStatuses } from './importer';
import { me } from '../initial_state';

export const FAVOURITED_STATUSES_FETCH_REQUEST = 'FAVOURITED_STATUSES_FETCH_REQUEST';
export const FAVOURITED_STATUSES_FETCH_SUCCESS = 'FAVOURITED_STATUSES_FETCH_SUCCESS';
export const FAVOURITED_STATUSES_FETCH_FAIL    = 'FAVOURITED_STATUSES_FETCH_FAIL';

export const FAVOURITED_STATUSES_EXPAND_REQUEST = 'FAVOURITED_STATUSES_EXPAND_REQUEST';
export const FAVOURITED_STATUSES_EXPAND_SUCCESS = 'FAVOURITED_STATUSES_EXPAND_SUCCESS';
export const FAVOURITED_STATUSES_EXPAND_FAIL    = 'FAVOURITED_STATUSES_EXPAND_FAIL';

export function fetchFavoritedStatuses() {
  return (dispatch, getState) => {
    if (!me) return;

    if (getState().getIn(['status_lists', 'favourites', 'isLoading'])) {
      return;
    }

    dispatch(fetchFavoritedStatusesRequest());

    api(getState).get('/api/v1/favourites').then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(fetchFavoritedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(fetchFavoritedStatusesFail(error));
    });
  };
};

export function fetchFavoritedStatusesRequest() {
  return {
    type: FAVOURITED_STATUSES_FETCH_REQUEST,
    skipLoading: true,
  };
};

export function fetchFavoritedStatusesSuccess(statuses, next) {
  return {
    type: FAVOURITED_STATUSES_FETCH_SUCCESS,
    statuses,
    next,
    skipLoading: true,
  };
};

export function fetchFavoritedStatusesFail(error) {
  return {
    type: FAVOURITED_STATUSES_FETCH_FAIL,
    error,
    skipLoading: true,
  };
};

export function expandFavoritedStatuses() {
  return (dispatch, getState) => {
    if (!me) return;
    
    const url = getState().getIn(['status_lists', 'favourites', 'next'], null);

    if (url === null || getState().getIn(['status_lists', 'favourites', 'isLoading'])) {
      return;
    }

    dispatch(expandFavoritedStatusesRequest());

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedStatuses(response.data));
      dispatch(expandFavoritedStatusesSuccess(response.data, next ? next.uri : null));
    }).catch(error => {
      dispatch(expandFavoritedStatusesFail(error));
    });
  };
};

export function expandFavoritedStatusesRequest() {
  return {
    type: FAVOURITED_STATUSES_EXPAND_REQUEST,
  };
};

export function expandFavoritedStatusesSuccess(statuses, next) {
  return {
    type: FAVOURITED_STATUSES_EXPAND_SUCCESS,
    statuses,
    next,
  };
};

export function expandFavoritedStatusesFail(error) {
  return {
    type: FAVOURITED_STATUSES_EXPAND_FAIL,
    error,
  };
};
