import {
  GAB_TRENDS_FETCH_REQUEST,
  GAB_TRENDS_FETCH_SUCCESS,
  GAB_TRENDS_FETCH_FAIL,
  GAB_TREND_FEED_EXPAND_REQUEST,
  GAB_TREND_FEED_EXPAND_SUCCESS,
  GAB_TREND_FEED_EXPAND_FAIL,
  GAB_NEWS_FETCH_REQUEST,
  GAB_NEWS_FETCH_SUCCESS,
  GAB_NEWS_FETCH_FAIL,
  LATEST_GAB_STATUSES_FETCH_REQUEST,
  LATEST_GAB_STATUSES_FETCH_SUCCESS,
  LATEST_GAB_STATUSES_FETCH_FAIL,
} from '../actions/news'
import {
  Map as ImmutableMap,
  List as ImmutableList,
  fromJS,
} from 'immutable'

const defaultMap = ImmutableMap({
  isLoading: false,
  isFetched: false,
  items: ImmutableList(),
})

const initialState = ImmutableMap({
  trends_leadline: ImmutableMap({
    title: null,
    image: null,
    trends_url: null,
  }),
  trends_headlines: defaultMap,
  trends_breaking: defaultMap,
  gab_news: defaultMap,
  latest_from_gab: defaultMap,
  trends_feeds: ImmutableMap(), // ex: { 'feed_id_1': defaultMap, 'feed_id_2': defaultMap, ... }
})

const normalizeHeadlineItem = (item) => {
  return ImmutableMap({
    trend_id: item._id,
    title: item.title,
    trends_url: `https://trends.gab.com/trend?url=${item.href}`,
  })
}

const normalizeTrendsItem = (item) => {
  return ImmutableMap({
    title: `${item.pagePreview.title}`.trim(),
    description: `${item.pagePreview.description}`.trim(),
    publish_date: item.pubDate,
    image: Array.isArray(item.pagePreview.images) ? item.pagePreview.images[0] : null, // : todo : proxy
    feed_title: item.feed.title,
    feed_slug: item.feed.slug,
    feed_base_url: `${item.feed.url}`.replace('www.', '').replace('https://', '').replace('http://', '').replace('/', ''),
    trend_feed_id: item.feed._id,
    trend_id: item._id,
    trends_url: `https://trends.gab.com/trend?url=${item.link}`,
  })
}

const normalizeNewsItem = (item) => {
  return ImmutableMap({
    id: item.id,
    url: item.url,
    title: item.title,
    image: item.image,
    publish_date: item.date_published,
  })
}

const setStateKeysOnRequest = (state, keys) => {
  return state.withMutations((map) => {
    keys.map((key) => map.setIn([key, 'isLoading'], true))
  })
}

const setStateKeysOnFail = (state, keys) => {
  return state.withMutations((map) => {
    keys.map((key) => {
      map.setIn([key, 'isLoading'], false)
      map.setIn([key, 'isFetched'], true)
      map.setIn([key, 'items'], ImmutableList())
    })
  })
}

const setStateKeysOnSuccess = (state, keysAndData) => {
  return state.withMutations((map) => {
    Object.keys(keysAndData).map((key) => {
      map.setIn([key, 'isLoading'], false)
      map.setIn([key, 'isFetched'], true)
      map.setIn([key, 'items'], keysAndData[key])
    })
  })
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GAB_TRENDS_FETCH_REQUEST:
      return setStateKeysOnRequest(state, ['trends_headlines', 'trends_breaking'])
    case GAB_TRENDS_FETCH_FAIL:
      return setStateKeysOnFail(state, ['trends_headlines', 'trends_breaking'])
    case GAB_TRENDS_FETCH_SUCCESS:
      let trendsFetchData = {}
      try {
        trendsFetchData.trends_headlines = ImmutableList(action.items.trends.leadHeadlines.map((item) => normalizeHeadlineItem(item)))
        trendsFetchData.trends_breaking = ImmutableList(action.items.trends.rssFeedItems.map((item) => normalizeTrendsItem(item)))
      } catch (error) {
        trendsFetchData = {
          breakingItems: ImmutableList(),
          headlineItems: ImmutableList(),
        }
      }
      // : todo :
      // trends_leadline: ImmutableMap({
      //   title: null,
      //   image: null,
      //   trends_url: null,
      // }),

      return setStateKeysOnSuccess(state, trendsFetchData)

    // 
    case LATEST_GAB_STATUSES_FETCH_REQUEST:
      return setStateKeysOnRequest(state, ['latest_from_gab'])
    case LATEST_GAB_STATUSES_FETCH_FAIL:
      return setStateKeysOnFail(state, ['latest_from_gab'])
    case LATEST_GAB_STATUSES_FETCH_SUCCESS:
      let latestGabStatusData = {}
      try {
        latestGabStatusData.latest_from_gab = ImmutableList(action.statuses.map((status) => status.id))
      } catch (error) {
        latestGabStatusData = {
          latest_from_gab: ImmutableList(),
        }
      }
      return setStateKeysOnSuccess(state, latestGabStatusData)

    // 
    case GAB_NEWS_FETCH_REQUEST:
      return setStateKeysOnRequest(state, ['gab_news'])
    case GAB_NEWS_FETCH_FAIL:
      return setStateKeysOnFail(state, ['gab_news'])
    case GAB_NEWS_FETCH_SUCCESS:
      let latestGabNewsData = {}
      try {
        latestGabNewsData.gab_news = ImmutableList(action.items.map((item) => normalizeNewsItem(item)))
      } catch (error) {
        console.log("news reducer error: ", error)
        latestGabNewsData = {
          gab_news: ImmutableList(),
        }
      }
      return setStateKeysOnSuccess(state, latestGabNewsData)
      
    default:
      return state
  }
}
