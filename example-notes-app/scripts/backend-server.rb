require 'sinatra'
require "sinatra/cors"

set :allow_origin, "http://0.0.0.0:8080"
set :allow_methods, "GET,HEAD,POST"
set :allow_headers, "content-type,if-modified-since"
set :expose_headers, "location,link"
set(:port, 3000)

$notes_count = 0

class Note
  attr_accessor :id, :content
  def initialize(content)
    @content = content
  end

  def self.create(content)
    note = self.new(content)
    $notes_count += 1
    note.id = $notes_count
    note
  end
end

file = File.read('notes.json')
json = JSON.parse(file)

$notes = json.map do |note|
  Note.create(note['content'])
end


get '/note/get' do
  index = $notes.index { |note| note.id == params['id'].to_i }
  note = $notes[index]
  puts 'note show: ' + note.content
  {id: params['id'], content: note.content }.to_json
end

get '/note/batch' do
  if params['action'] === 'all'
    puts 'note all'
    $notes
      .map { |note| {id: note.id, content: note.content }}
      .to_json
  end

end

post '/note/post' do
  request.body.rewind  # in case someone already read it
  data = JSON.parse request.body.read
  puts 'adding note: ' + data['content']
  note = Note.create(data['content'])
  $notes = $notes.push(note)
  { id: note.id, content: note.content }.to_json
end

post '/note/put' do
  request.body.rewind  # in case someone already read it
  data = JSON.parse request.body.read

  note = $notes[data['id'].to_i - 1]
  puts 'updating note: ' + data['id'].to_s
  note.content = data['content']
  { id: note.id, content: note.content }.to_json
end
