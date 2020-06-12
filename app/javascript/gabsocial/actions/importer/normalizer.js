import escapeTextContentForBrowser from 'escape-html'
import { markdownToDraft } from 'markdown-draft-js'
import { Remarkable } from 'remarkable'
import * as entities from 'entities'
import emojify from '../../components/emoji/emoji'
import { unescapeHTML } from '../../utils/html'
import { expandSpoilers } from '../../initial_state'

const domParser = new DOMParser()

const makeEmojiMap = record => record.emojis.reduce((obj, emoji) => {
  obj[`:${emoji.shortcode}:`] = emoji;
  return obj;
}, {});

export function normalizeAccount(account) {
  account = { ...account };

  const emojiMap = makeEmojiMap(account);
  const displayName = account.display_name.trim().length === 0 ? account.username : account.display_name;

  account.display_name_html = emojify(escapeTextContentForBrowser(displayName), emojiMap);
  account.display_name_plain = emojify(escapeTextContentForBrowser(displayName), emojiMap, true);
  account.note_emojified = emojify(account.note, emojiMap);

  if (account.fields) {
    account.fields = account.fields.map(pair => ({
      ...pair,
      name_emojified: emojify(escapeTextContentForBrowser(pair.name)),
      value_emojified: emojify(pair.value, emojiMap),
      value_plain: unescapeHTML(pair.value),
    }));
  }

  if (account.moved) {
    account.moved = account.moved.id;
  }

  return account;
}

export function normalizeStatus(status, normalOldStatus) {
  const normalStatus   = { ...status };
  normalStatus.account = status.account.id;

  if (status.reblog && status.reblog.id) {
    normalStatus.reblog = status.reblog.id;
  }

  if (status.quote && status.quote.id) {
    normalStatus.quote = status.quote.id;
  }

  if (status.poll && status.poll.id) {
    normalStatus.poll = status.poll.id;
  }

  // Only calculate these values when status first encountered
  // Otherwise keep the ones already in the reducer
  if (normalOldStatus && normalOldStatus.get('content') === normalStatus.content && normalOldStatus.get('spoiler_text') === normalStatus.spoiler_text) {
    normalStatus.search_index = normalOldStatus.get('search_index');
    normalStatus.contentHtml = normalOldStatus.get('contentHtml');
    normalStatus.spoilerHtml = normalOldStatus.get('spoilerHtml');
    normalStatus.hidden = normalOldStatus.get('hidden');
  } else {
    const spoilerText   = normalStatus.spoiler_text || '';
    const searchContent = [spoilerText, status.content].join('\n\n').replace(/<br\s*\/?>/g, '\n').replace(/<\/p><p>/g, '\n\n');
    const emojiMap      = makeEmojiMap(normalStatus);
    
    let theContent
    if (!!normalStatus.rich_content) {
      theContent = normalStatus.rich_content
      // let rawObject = markdownToDraft(theContent, {
      //   preserveNewlines: true,
      //   remarkablePreset: 'commonmark',
      //   remarkableOptions: {
      //     enable: {
      //       inline: ['del', 'ins'],
      //     }
      //   }
      // });

      const md = new Remarkable({
        html: false,
        breaks: true,
      })
      let html = md.render(theContent)
      html = entities.decodeHTML(html)
      
      theContent = html

      console.log("html:", html)
      console.log("theContent:", theContent)
      console.log("status:", status)
      console.log("normalStatus:", normalStatus)
      // console.log("rawObject:", rawObject)
    } else {
      theContent = normalStatus.content
    }
    // let theContent = !!normalStatus.rich_content ? normalStatus.rich_content : normalStatus.content;

    
    normalStatus.search_index = domParser.parseFromString(searchContent, 'text/html').documentElement.textContent;
    normalStatus.contentHtml  = emojify(theContent, emojiMap, false, true);
    normalStatus.spoilerHtml  = emojify(escapeTextContentForBrowser(spoilerText), emojiMap);
    normalStatus.hidden       = expandSpoilers ? false : spoilerText.length > 0 || normalStatus.sensitive;
  }

  return normalStatus;
}

export function normalizePoll(poll) {
  const normalPoll = { ...poll };

  const emojiMap = makeEmojiMap(normalPoll);

  normalPoll.options = poll.options.map(option => ({
    ...option,
    title_emojified: emojify(escapeTextContentForBrowser(option.title), emojiMap),
  }));

  return normalPoll;
}


// <p><h1>attention!</h1></p>
// <p>#test @bob #nice https://bob.com http://techcrunch.com <del>strike it</del></p>
// <p><del>https://twitter.com</del></p>
// <p><em>@bobitalic</em></p>
// <p><pre><code>jonincode</code></pre></p>

// # attention!
// #test @bob #nice https://bob.com http://techcrunch.com ~~strike it~~

// ~~https://twitter.com~~

// _@bobitalic_

// ```
// jonincode
// ```