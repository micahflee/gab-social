import {
  ALBUMS_FETCH_REQUEST,
  ALBUMS_FETCH_SUCCESS,
  ALBUMS_FETCH_FAIL,
  ALBUM_CREATE_SUCCESS,
  ALBUM_REMOVE_REQUEST,
} from '../actions/albums'
import { Map as ImmutableMap, List as ImmutableList, fromJS } from 'immutable'

const importAlbum = (state, album) => state.set(album.id, fromJS(album))

const importAlbums = (state, albums) =>
  state.withMutations((mutable) => albums.forEach((album) => importAlbum(mutable, album)))

const initialState = ImmutableMap()

export default function albums(state = initialState, action) {
  switch(action.type) {
    case ALBUMS_FETCH_SUCCESS:
      return importAlbums(state, action.albums)
    case ALBUM_CREATE_SUCCESS:
      return importAlbum(state, action.album)
    case ALBUM_REMOVE_REQUEST:
      return state.delete(action.albumId)
    default:
      return state
  }
}
