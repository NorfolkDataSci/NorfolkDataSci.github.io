# encoding: utf-8

module Nanoc::DataSources

  # @deprecated Fetch data from online data sources manually instead
  class LastFM < Nanoc::DataSource

    def items
      @items ||= begin
        require 'json'
        require 'uri'

        # Check configuration
        if config[:username].nil?
          raise 'LastFM data source requires a username in the configuration'
        end
        if config[:api_key].nil?
          raise 'LastFM data source requires an API key in the configuration'
        end

        # Get data
        @http_client ||= Nanoc::Extra::CHiCk::Client.new
        _status, _headers, data = *@http_client.get(
          'http://ws.audioscrobbler.com/2.0/' +
            '?method=user.getRecentTracks' +
            '&format=json' +
            '&user=' + URI.escape(config[:username]) +
            '&api_key=' + URI.escape(config[:api_key])
        )

        # Parse as JSON
        parsed_data = JSON.parse(data)
        raw_items = parsed_data['recenttracks']['track']

        # Convert to items
        raw_items.enum_with_index.map do |raw_item, i|
          # Get artist data
          _artist_status, _artist_headers, artist_data = *@http_client.get(
            'http://ws.audioscrobbler.com/2.0/' +
              '?method=artist.getInfo' +
              '&format=json' +
              (
                if raw_item['artist']['mbid'].empty?
                  '&artist=' + URI.escape(raw_item['artist']['#text'])
                else
                  '&mbid=' + URI.escape(raw_item['artist']['mbid'])
                end
              ) +
              '&api_key=' + URI.escape(config[:api_key])
          )

          # Parse as JSON
          parsed_artist_data = JSON.parse(artist_data)
          raw_artist_info = parsed_artist_data['artist']

          # Build data
          content = ''

          # Handle track dates
          if raw_item['@attr'] && raw_item['@attr']['nowplaying'] == 'true'
            track_played_at = Time.now
            now_playing = true
          else
            track_played_at = Time.parse(raw_item['date']['#text'])
            now_playing = false
          end

          attributes = {
            :name      => raw_item['name'],
            :artist    => {
              :name      => raw_artist_info['name'],
              :url       => raw_artist_info['url']
            },
            :url       => raw_item['url'],
            :played_at => track_played_at,
            :now_playing => now_playing
          }
          identifier = "/#{i}/"
          mtime = nil

          # Build item
          Nanoc::Item.new(content, attributes, identifier, mtime)
        end
      end
    end

  end

end
