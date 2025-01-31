# start web server
~/C/uweb/uweb -p 8080 -d "/media/sf_ff8000/web_site/ff8000/"

# monitor chnages on txt files
find "/media/sf_ff8000/web_site/ff8000/" -name "*.txt" |
  xargs inotifywait -r -m -e close_write |
     while read file_path file_event file_name 
        do ~/C/txt2html/txt2html ${file_path}${file_name} 
     done

