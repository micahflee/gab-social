# frozen_string_literal: true

require 'singleton'
require_relative './sanitize_config'
require 'redcarpet'

class Formatter
  include Singleton
  include RoutingHelper

  include ActionView::Helpers::TextHelper

  class CustomRender < Redcarpet::Render::HTML
    def paragraph(text)
      %(<p>#{text}</p>)
    end
  end

  def format(status, **options)
    if options[:use_markdown]
      raw_content = status.markdown
      return '' if raw_content.blank?
    else
      raw_content = status.text
    end

    raw_content = ActionController::Base.helpers.strip_tags(raw_content) if status.id <= 11063737261633602 # #TODO: Migration fix

    if status.reblog?
      status = status.proper
    end

    if options[:inline_poll_options] && status.preloadable_poll
      raw_content = raw_content + "\n\n" + status.preloadable_poll.options.map { |title| "[ ] #{title}" }.join("\n")
    end

    return '' if raw_content.blank?

    unless status.local?
      html = reformat(raw_content)
      html = encode_custom_emojis(html, status.emojis, options[:autoplay]) if options[:custom_emojify]
      return html.html_safe # rubocop:disable Rails/OutputSafety
    end

    linkable_accounts = status.active_mentions.map(&:account)
    linkable_accounts << status.account

    html = raw_content

    html = encode_and_link_urls(html, linkable_accounts)

    # : todo :
    if options[:use_markdown]
      html = convert_headers(html)
      html = convert_strong(html)
      html = convert_italic(html)
      html = convert_strikethrough(html)
      html = convert_code(html)
      html = convert_codeblock(html)
      html = convert_links(html)
      html = convert_lists(html)
      html = convert_ordered_lists(html)
    end

    html = encode_custom_emojis(html, status.emojis, options[:autoplay]) if options[:custom_emojify]

    html = simple_format(html, {}, sanitize: false)

    html = html.delete("\n")

    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def reformat(html)
    sanitize(html, Sanitize::Config::GABSOCIAL_STRICT)
  rescue ArgumentError
    ''
  end

  def plaintext(status)
    return status.text if status.local?

    text = status.text.gsub(/(<br \/>|<br>|<\/p>)+/) { |match| "#{match}\n" }
    strip_tags(text)
  end

  def simplified_format(account, **options)
    html = account.local? ? linkify(account.note) : reformat(account.note)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def sanitize(html, config)
    Sanitize.fragment(html, config)
  end

  def format_spoiler(status, **options)
    html = encode(status.spoiler_text)
    html = encode_custom_emojis(html, status.emojis, options[:autoplay])
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_poll_option(status, option, **options)
    html = encode(option.title)
    html = encode_custom_emojis(html, status.emojis, options[:autoplay])
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_display_name(account, **options)
    html = encode(account.display_name.presence || account.username)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def format_field(account, str, **options)
    return reformat(str).html_safe unless account.local? # rubocop:disable Rails/OutputSafety
    html = encode_and_link_urls(str, me: true)
    html = encode_custom_emojis(html, account.emojis, options[:autoplay]) if options[:custom_emojify]
    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  def linkify(text)
    html = encode_and_link_urls(text)
    html = simple_format(html, {}, sanitize: false)
    html = html.delete("\n")

    html.html_safe # rubocop:disable Rails/OutputSafety
  end

  private

  def html_entities
    @html_entities ||= HTMLEntities.new
  end

  def encode(html)
    html_entities.encode(html)
  end

  def encode_and_link_urls(html, accounts = nil, options = {})
    entities = utf8_friendly_extractor(html, extract_url_without_protocol: false)

    if accounts.is_a?(Hash)
      options  = accounts
      accounts = nil
    end

    rewrite(html.dup, entities) do |entity|
      if entity[:url]
        link_to_url(entity, options)
      elsif entity[:hashtag]
        link_to_hashtag(entity)
      elsif entity[:screen_name]
        link_to_mention(entity, accounts)
      end
    end
  end

  def count_tag_nesting(tag)
    if tag[1] == '/' then -1
    elsif tag[-2] == '/' then 0
    else 1
    end
  end

  def encode_custom_emojis(html, emojis, animate = false)
    return html if emojis.empty?

    emoji_map = if animate
                  emojis.each_with_object({}) { |e, h| h[e.shortcode] = full_asset_url(e.image.url) }
                else
                  emojis.each_with_object({}) { |e, h| h[e.shortcode] = full_asset_url(e.image.url(:static)) }
                end

    i                     = -1
    tag_open_index        = nil
    inside_shortname      = false
    shortname_start_index = -1
    invisible_depth       = 0

    while i + 1 < html.size
      i += 1

      if invisible_depth.zero? && inside_shortname && html[i] == ':'
        shortcode = html[shortname_start_index + 1..i - 1]
        emoji     = emoji_map[shortcode]

        if emoji
          replacement = "<img draggable=\"false\" class=\"emojione\" alt=\":#{encode(shortcode)}:\" title=\":#{encode(shortcode)}:\" src=\"#{encode(emoji)}\" />"
          before_html = shortname_start_index.positive? ? html[0..shortname_start_index - 1] : ''
          html        = before_html + replacement + html[i + 1..-1]
          i          += replacement.size - (shortcode.size + 2) - 1
        else
          i -= 1
        end

        inside_shortname = false
      elsif tag_open_index && html[i] == '>'
        tag = html[tag_open_index..i]
        tag_open_index = nil
        if invisible_depth.positive?
          invisible_depth += count_tag_nesting(tag)
        elsif tag == '<span class="invisible">'
          invisible_depth = 1
        end
      elsif html[i] == '<'
        tag_open_index   = i
        inside_shortname = false
      elsif !tag_open_index && html[i] == ':'
        inside_shortname      = true
        shortname_start_index = i
      end
    end

    html
  end

  def rewrite(text, entities)
    text = text.to_s

    # Sort by start index
    entities = entities.sort_by do |entity|
      indices = entity.respond_to?(:indices) ? entity.indices : entity[:indices]
      indices.first
    end

    result = []

    last_index = entities.reduce(0) do |index, entity|
      indices = entity.respond_to?(:indices) ? entity.indices : entity[:indices]
      result << encode(text[index...indices.first])
      result << yield(entity)
      indices.last
    end

    result << encode(text[last_index..-1])

    result.flatten.join
  end

  UNICODE_ESCAPE_BLACKLIST_RE = /\p{Z}|\p{P}/

  def utf8_friendly_extractor(text, options = {})
    old_to_new_index = [0]

    escaped = text.chars.map do |c|
      output = begin
        if c.ord.to_s(16).length > 2 && UNICODE_ESCAPE_BLACKLIST_RE.match(c).nil?
          CGI.escape(c)
        else
          c
        end
      end

      old_to_new_index << old_to_new_index.last + output.length

      output
    end.join

    # Note: I couldn't obtain list_slug with @user/list-name format
    # for mention so this requires additional check
    special = Extractor.extract_urls_with_indices(escaped, options).map do |extract|
      new_indices = [
        old_to_new_index.find_index(extract[:indices].first),
        old_to_new_index.find_index(extract[:indices].last),
      ]

      next extract.merge(
        indices: new_indices,
        url: text[new_indices.first..new_indices.last - 1]
      )
    end

    standard = Extractor.extract_entities_with_indices(text, options)

    Extractor.remove_overlapping_entities(special + standard)
  end

  def link_to_url(entity, options = {})
    url        = Addressable::URI.parse(entity[:url])
    html_attrs = { target: '_blank', rel: 'nofollow noopener noreferrer' }

    html_attrs[:rel] = "me #{html_attrs[:rel]}" if options[:me]

    Twitter::Autolink.send(:link_to_text, entity, link_html(entity[:url]), url, html_attrs)
  rescue Addressable::URI::InvalidURIError, IDN::Idna::IdnaError
    encode(entity[:url])
  end

  def link_to_mention(entity, linkable_accounts)
    acct = entity[:screen_name]

    return link_to_account(acct) unless linkable_accounts

    account = linkable_accounts.find { |item| TagManager.instance.same_acct?(item.acct, acct) }
    account ? mention_html(account) : "@#{encode(acct)}"
  end

  def link_to_account(acct)
    username, domain = acct.split('@')

    domain  = nil if TagManager.instance.local_domain?(domain)
    account = EntityCache.instance.mention(username, domain)

    account ? mention_html(account) : "@#{encode(acct)}"
  end

  def link_to_hashtag(entity)
    hashtag_html(entity[:hashtag])
  end

  def link_html(url)
    url    = Addressable::URI.parse(url).to_s
    prefix = url.match(/\Ahttps?:\/\/(www\.)?/).to_s
    text   = url[prefix.length, 30]
    suffix = url[prefix.length + 30..-1]
    cutoff = url[prefix.length..-1].length > 30

    "<span aria-hidden=\"true\" class=\"invisible\">#{encode(prefix)}</span>#{encode(text)}<span aria-hidden=\"true\" class=\"invisible\">#{encode(suffix)}</span>" + (cutoff ? "<span aria-hidden=\"true\" class=\"ellipsis\">…</span>" : "")
  end

  def hashtag_html(tag)
    "<a data-focusable=\"true\" role=\"link\" href=\"#{encode(tag_url(tag.downcase))}\" class=\"mention hashtag\" rel=\"tag\">##{encode(tag)}</a>"
  end

  def mention_html(account)
    "<a data-focusable=\"true\" role=\"link\" href=\"#{encode(TagManager.instance.url_for(account))}\" class=\"u-url mention\">@#{encode(account.acct)}</a>"
  end

  def convert_headers(html)
    html.gsub(/^\#{1,6}.*$/) do |header|
      weight = 0
      header.split('').each do |char|
        break unless char == '#'
        weight += 1
      end
      content = header.sub(/^\#{1,6}/, '')
      "<h#{weight}>#{content}</h#{weight}>"
    end
  end

  def convert_strong(html)
    html.gsub(/\*{2}.*\*{2}|_{2}.*_{2}/) do |strong|
      content = strong.gsub(/\*{2}|_{2}/, '')
      "<strong>#{content}</strong>"
    end
  end

  def convert_italic(html)
    html.gsub(/\*{1}(\w|\s)+\*{1}|_{1}(\w|\s)+_{1}/) do |italic|
      content = italic.gsub(/\*{1}|_{1}/, '')
      "<em>#{content}</em>"
    end
  end

  def convert_strikethrough(html)
    html.gsub(/~~(\w|\s)+~~/) do |strike|
      content = strike.gsub(/~~/, '')
      "<strike>#{content}</strike>"
    end
  end

  def convert_code(html)
    html.gsub(/`(\w|\s)+`/) do |code|
      content = code.gsub(/`/, '')
      "<code>#{content}</code>"
    end
  end

  def convert_codeblock(html)
    html.gsub(/```\w*(.*(\r\n|\r|\n))+```/) do |code|
      lang = code.match(/```\w+/)[0].gsub(/`/, '')
      content = code.gsub(/```\w+/, '```').gsub(/`/, '')
      "<pre class=\"#{lang}\"><code>#{content}</code></pre>"
    end
  end

  def convert_links(html)
    html.gsub(/\[(\w|\s)+\]\((\w|\W)+\)/) do |anchor|
      link_text = anchor.match(/\[(\w|\s)+\]/)[0].gsub(/[\[\]]/, '')
      href = anchor.match(/\((\w|\W)+\)/)[0].gsub(/\(|\)/, '')
      "<a href=\"#{href}\">#{link_text}</a>"
    end
  end

  def convert_lists(html)
    html.gsub(/(\-.+(\r|\n|\r\n))+/) do |list|
      items = "<ul>\n"
      list.gsub(/\-.+/) do |li|
        items << "<li>#{li.sub(/^\-/, '').strip}</li>\n"
      end
      items << "</ul>\n"
    end
  end

  def convert_ordered_lists(html)
    html.gsub(/(\d\..+(\r|\n|\r\n))+/) do |list|
      items = "<ol>\n"
      list.gsub(/\d.+/) do |li|
        items << "<li>#{li.sub(/^\d\./, '').strip}</li>\n"
      end
      items << "</ol>\n"
    end
  end
end
