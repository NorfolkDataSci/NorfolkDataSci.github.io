# -*- encoding: utf-8 -*-
# stub: cri 2.6.1 ruby lib

Gem::Specification.new do |s|
  s.name = "cri"
  s.version = "2.6.1"

  s.required_rubygems_version = Gem::Requirement.new(">= 0") if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib"]
  s.authors = ["Denis Defreyne"]
  s.date = "2014-05-27"
  s.description = "Cri allows building easy-to-use commandline interfaces with support for subcommands."
  s.email = "denis.defreyne@stoneship.org"
  s.extra_rdoc_files = ["LICENSE", "README.adoc", "NEWS.md"]
  s.files = ["LICENSE", "NEWS.md", "README.adoc"]
  s.homepage = "http://stoneship.org/software/cri/"
  s.licenses = ["MIT"]
  s.rdoc_options = ["--main", "README.adoc"]
  s.rubygems_version = "2.2.3"
  s.summary = "a library for building easy-to-use commandline tools"

  s.installed_by_version = "2.2.3" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4

    if Gem::Version.new(Gem::VERSION) >= Gem::Version.new('1.2.0') then
      s.add_runtime_dependency(%q<colored>, ["~> 1.2"])
      s.add_development_dependency(%q<bundler>, ["~> 1.6"])
    else
      s.add_dependency(%q<colored>, ["~> 1.2"])
      s.add_dependency(%q<bundler>, ["~> 1.6"])
    end
  else
    s.add_dependency(%q<colored>, ["~> 1.2"])
    s.add_dependency(%q<bundler>, ["~> 1.6"])
  end
end
