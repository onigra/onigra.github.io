---
title: "td-client-rubyを使ってみたのでサンプルスクリプト晒す"
slug: "td-client-sample"
categories:
- TreasureData
date: "2014-01-07T00:00:00Z"
---

最近仕事でTreasureDataを扱うことが多く、td-client-rubyを使って色々やってみてる。  
簡単に使い回せそうなスクリプト書いてみたけどもうちょっと汎用性持たせたい。  

<!--more-->

```rb
module Hql
  class << self
    def get_access_log_by_timestamp(from_date, to_date)
      h = <<-EOS
select
  *
from
  www_access
where
  TD_TIME_RANGE(time, '#{from_date}', '#{to_date}', 'JST')
      EOS
      h
    end
  end
end
```

```rb
require 'td'
require 'td-client'
require 'optparse'
require_relative 'hql'
 
###
#
# option
#
op = OptionParser.new
op.banner = <<EOS
usage: #{__FILE__} -f #{(Time.now - 24 * 60 * 60).strftime('%Y-%m-%d')} -t #{Time.now.strftime('%Y-%m-%d')}
 
options:
EOS
 
from_date, to_date, prod = nil
 
op.on("-f FROM_DATE") do |s|
  from_date = s
end
 
op.on("-t TO_DATE") do |s|
  to_date = s
end
 
op.on("--prod") do |b|
  prod = true
end
 
###
#
# methods
#
(class << self; self; end).module_eval do
  define_method :usage do
    puts op.to_s
    puts ""
    exit 0
  end
 
  define_method :run do
    api_key = File.read "api_key"
    cln = TreasureData::Client.new api_key
 
    job = cln.query('sample_db', "#{Hql.get_access_log_by_timestamp from_date, to_date}")
    
    until job.finished?
      sleep 2
      job.update_progress!
    end
    
    job.update_status!
    job.result_each {|row| p row}
  end
end
 
###
#
# main
#
ARGV.empty? ? usage : op.order!(ARGV)
prod ? run : (puts Hql.get_access_log_by_timestamp from_date, to_date)
```
