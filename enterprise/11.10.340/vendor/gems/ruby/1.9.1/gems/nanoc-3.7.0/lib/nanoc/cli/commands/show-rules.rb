# encoding: utf-8

usage       'show-rules [thing]'
aliases     :explain
summary     'describe the rules for each item'
description "
Prints the rules used for all items and layouts in the current site.
"

module Nanoc::CLI::Commands

  class ShowRules < ::Nanoc::CLI::CommandRunner

    def run
      require_site

      @c    = Nanoc::CLI::ANSIStringColorizer
      @calc = site.compiler.rule_memory_calculator

      # TODO explain /foo/
      # TODO explain content/foo.html
      # TODO explain output/foo/index.html

      site.items.each   { |i| explain_item(i)   }
      site.layouts.each { |l| explain_layout(l) }
    end

  protected

    def explain_item(item)
      puts "#{@c.c('Item ' + item.identifier, :bold, :yellow)}:"
      puts "  (from #{item[:filename]})" if item[:filename]
      item.reps.each do |rep|
        puts "  Rep #{rep.name}:"
        if @calc[rep].empty? && rep.raw_path.nil?
          puts '    (nothing)'
        else
          @calc[rep].each do |mem|
            puts '    %s %s' % [
              @c.c(format('%-10s', mem[0].to_s), :blue),
              mem[1..-1].map { |m| m.inspect }.join(', ')
            ]
          end
          if rep.raw_path
            puts '    %s %s' % [
              @c.c(format('%-10s', 'write to'), :blue),
              rep.raw_path
            ]
          end
        end
      end
      puts
    end

    def explain_layout(layout)
      puts "#{@c.c('Layout ' + layout.identifier, :bold, :yellow)}:"
      puts "  (from #{layout[:filename]})" if layout[:filename]
      puts '  %s %s' % [
        @c.c(format('%-10s', 'filter'), :blue),
        @calc[layout].map { |m| m.inspect }.join(', ')
      ]
      puts
    end

  end

end

runner Nanoc::CLI::Commands::ShowRules
