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

module Kramdown

  # == \Utils Module
  #
  # This module contains utility class/modules/methods that can be used by both parsers and
  # converters.
  module Utils

    autoload :Entities, 'kramdown/utils/entities'
    autoload :Html, 'kramdown/utils/html'
    autoload :OrderedHash, 'kramdown/utils/ordered_hash'

    # Treat +name+ as if it were snake cased (e.g. snake_case) and camelize it (e.g. SnakeCase).
    def self.camelize(name)
      name.split('_').inject('') {|s,x| s << x[0..0].upcase + x[1..-1] }
    end

  end

end
