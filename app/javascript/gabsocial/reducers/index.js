import { combineReducers } from 'redux-immutable'
import { loadingBarReducer } from 'react-redux-loading-bar'
import accounts from './accounts'
import accounts_counters from './accounts_counters'
import chats from './chats'
import chat_conversation_lists from './chat_conversation_lists'
import chat_conversation_messages from './chat_conversation_messages'
import chat_conversations from './chat_conversations'
import chat_messages from './chat_messages'
import compose from './compose'
import contexts from './contexts'
import custom_emojis from './custom_emojis'
import deck from './deck'
import filters from './filters'
import groups from './groups'
import group_categories from './group_categories'
import group_editor from './group_editor'
import group_lists from './group_lists'
import group_relationships from './group_relationships'
import height_cache from './height_cache'
import links from './links.js'
import lists from './lists'
import listAdder from './list_adder'
import listEditor from './list_editor'
import media_attachments from './media_attachments'
import meta from './meta'
import modal from './modal'
import mutes from './mutes'
import news from './news'
import notifications from './notifications'
import polls from './polls'
import popover from './popover'
import promotions from './promotions'
import push_notifications from './push_notifications'
import relationships from './relationships'
import reports from './reports'
import search from './search'
import settings from './settings'
import shop from './shop'
import shortcuts from './shortcuts'
import sidebar from './sidebar'
import statuses from './statuses'
import status_lists from './status_lists'
import status_revisions from './status_revisions'
import suggestions from './suggestions'
import timelines from './timelines'
import timeline_injections from './timeline_injections'
import toasts from './toasts'
import user from './user'
import user_lists from './user_lists'

const reducers = {
  accounts,
  accounts_counters,
  chats,
  chat_conversation_lists,
  chat_conversation_messages,
  chat_conversations,
  chat_messages,
  compose,
  contexts,
  custom_emojis,
  deck,
  filters,
  groups,
  group_categories,
  group_editor,
  group_lists,
  group_relationships,
  height_cache,
  links,
  lists,
  listAdder,
  listEditor,
  loadingBar: loadingBarReducer,
  media_attachments,
  meta,
  modal,
  mutes,
  news,
  notifications,
  polls,
  popover,
  promotions,
  push_notifications,
  relationships,
  reports,
  search,
  settings,
  shop,
  shortcuts,
  sidebar,
  statuses,
  status_lists,
  status_revisions,
  suggestions,
  timelines,
  timeline_injections,
  toasts,
  user,
  user_lists,
}

export default combineReducers(reducers)
