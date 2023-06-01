const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require('fs');
const os = require('os');

let updatedCount;
let params;

const s3Client = new S3Client({
    region: "us-east-1",  // Update this with your region
    credentials: {
        accessKeyId: process.env.YOUR_AWS_KEY,
        secretAccessKey: process.env.YOUR_AWS_SECRET
    }
});

async function attemptTmpWriting() {
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
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        console.log("file uploaded");

    } catch (e) {
        console.error(e);
        throw e;
    }
}

exports.handler = async function (event, context) {
    await attemptTmpWriting();
    params.folder = os.tmpdir();
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({params}, null, 2)
    };
};
