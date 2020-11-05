const MailerService = require('./MailerService');

/* 
 Queue consumer service class 
 to process task in QueueService
*/
class QueueConsumerService {

  static startConsumer(queue) { // queue: QueueService
    console.log(`Starting Queue Consumer with interval ${process.env.CONSUMER_INTERVAL_TIME} milliseconds`);

    // a scheduler that process tasks in queue every set interval time
    setInterval(
      (queue) => {
        this.processTask(queue)
      }, 
      process.env.CONSUMER_INTERVAL_TIME,
      queue);
  }

  /*
    Function that takes a queue and process all the
    task in the queue. Tasks are to run async.
    Since, mail server might not process large request at once,
    sendMail is performed in bulk of fixed maximum size at a time
    
   */
  static async processTask(queue){
    console.log("Processing Queue")
    while (!queue.isEmpty()) {
      let limit = process.env.MAILER_SIZE_LIMIT;
      let bulk = []

      // create a task bulk of maximum size set by limit
      while (!queue.isEmpty() && limit >0) {
        let mailer = new MailerService();
        let task = queue.dequeue();
        bulk.push(mailer.sendMail(task));
        limit--;
      }

      // to reduce mail server load, wait till processing next tasks bulk
      await Promise.all(
        bulk.map((p) => p.catch( 
          e => console.log("QueueConsumerService: Mail Send Failed", e)
        ))
      ).catch((err)=>{
        console.log("QueueConsumerService: one or more mail failed in bulk mail request!!", err);
      }); // could use Promise.allSettled in node>12
      
    }
  }
}

module.exports = QueueConsumerService;