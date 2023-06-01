fs = require('fs');
const aws = require('aws-sdk');
const os = require('os');

let updatedCount;
let params;

function attemptTmpWriting() {
  return new Promise((resolve, reject) => {
    try {
      const exists = fs.existsSync('/tmp');
      const fileExists = fs.existsSync('/tmp/counter.txt');

      if (!exists) {
        fs.mkdirSync('/tmp', {recursive: true});
      }

      let count = 0;
      if (fileExists) {
        const countTxt = fs.readFileSync('/tmp/counter.txt', 'utf-8');
        if (countTxt !== undefined) {
          count = parseInt(countTxt, 10);
        }
      }

      updatedCount = ++count;
      let fileName = `/tmp/counter${updatedCount}.txt`;
      fs.writeFileSync("/tmp/counter.txt", (updatedCount).toString());
      fs.writeFileSync(fileName, (updatedCount).toString());

      params = {
        Key: `counter${updatedCount}.txt`,
        Body: updatedCount.toString(),
        Bucket: 'anilb-s3',
        ContentType: 'text/plain'
      };

      const s3 = new aws.S3({
        accessKeyId: process.env.YOUR_AWS_KEY,
        secretAccessKey: process.env.YOUR_AWS_SECRET
      });

      s3.putObject(params, function (err, response) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log("file uploaded");
          resolve();
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
}

exports.handler = async function (event, context) {
  await attemptTmpWriting();
  params.folder=os.tmpdir();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({params}, null, 2)
  };
}
