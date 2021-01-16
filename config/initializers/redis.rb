# frozen_string_literal: true
require 'connection_pool'



redis_connection = ConnectionPool::Wrapper.new(size: ENV['REDIS_POOL_SIZE'] || 5, timeout: 10) { Redis.new(
  url: ENV['REDIS_URL'],
  driver: :hiredis
)}

namespace = ENV.fetch('REDIS_NAMESPACE') { nil }

if namespace
  Redis.current = Redis::Namespace.new(namespace, redis: redis_connection)
else
  Redis.current = redis_connection
end
