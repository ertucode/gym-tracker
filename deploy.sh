# tar cf - .next/standalone | ssh ertu.codes 'tar xfC - ~/hosts'

tar cf - .next/standalone | gzip -3 | ssh ertu.codes '
  pm2 stop server && cd ~/hosts && mkdir helloworld && cd helloworld && gunzip | tar xf -  && mv .next/standalone ../gym && rmdir .next && cd .. && rmdir helloworld && cd gym && pm2 start server.js'
