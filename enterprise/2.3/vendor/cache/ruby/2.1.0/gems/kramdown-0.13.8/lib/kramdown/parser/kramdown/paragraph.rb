# -*- coding: utf-8 -*-
#
#--
# Copyright (C) 2009-2012 Thomas Leitner <t_leitner@gmx.at>
#
# This file is part of kramdown.
#
# kramdown is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#++
#

require 'kramdown/parser/kramdown/blank_line'
require 'kramdown/parser/kramdown/extensions'
require 'kramdown/parser/kramdown/eob'
require 'kramdown/parser/kramdown/list'
require 'kramdown/parser/kramdown/html'

module Kramdown
  module Parser
    class Kramdown

      LAZY_END_HTML_SPAN_ELEMENTS = HTML_SPAN_ELEMENTS + %w{script}
      LAZY_END_HTML_START = /<(?>(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR})\s*(?>\s+#{REXML::Parsers::BaseParser::UNAME_STR}\s*=\s*(["']).*?\1)*\s*\/?>/m
      LAZY_END_HTML_STOP = /<\/(?!(?:#{LAZY_END_HTML_SPAN_ELEMENTS.join('|')})\b)#{REXML::Parsers::BaseParser::UNAME_STR}\s*>/m

      LAZY_END = /#{BLANK_LINE}|#{IAL_BLOCK_START}|#{EOB_MARKER}|^#{OPT_SPACE}#{LAZY_END_HTML_STOP}|^#{OPT_SPACE}#{LAZY_END_HTML_START}|\Z/

      PARAGRAPH_START = /^#{OPT_SPACE}[^ \t].*?\n/
      PARAGRAPH_MATCH = /^.*?\n/
      PARAGRAPH_END = /#{LAZY_END}|#{DEFINITION_LIST_START}/

      # Parse the paragraph at the current location.
      def parse_paragraph
        result = @src.scan(PARAGRAPH_MATCH)
        while !@src.match?(self.class::PARAGRAPH_END)
          result << @src.scan(PARAGRAPH_MATCH)
        end
        result.chomp!
        if @tree.children.last && @tree.children.last.type == :p
          @tree.children.last.children.first.value << "\n" << result
        else
          @tree.children << new_block_el(:p)
          result.lstrip!
          @tree.children.last.children << Element.new(@text_type, result)
        end
        true
      end
      define_parser(:paragraph, PARAGRAPH_START)

    end
  end
end
