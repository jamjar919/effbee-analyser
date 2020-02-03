import iconv from 'iconv-lite';
import fs from 'fs';
import SettingsFile from '../SettingsFile';

class FacebookApi {
    constructor() {
        const settings = new SettingsFile();
        this.root = settings.get("facebookDataDir")
    }

    getRoot() {
        return this.root;
    }

    readFacebookJson(filename) {
        return JSON.parse(fs.readFileSync(filename, "utf8"))
    }

    fixEncoding(string) {
        return iconv.decode(iconv.encode(string, "latin1"), "utf8")
    }
}

export const bucketByTimeInterval = (dataList, firstTimestamp, lastTimestamp, timeInterval, timestampRetriever) => {
  // calculate number of buckets
  const timespan = lastTimestamp - firstTimestamp;
  const numBuckets = Math.ceil(timespan / timeInterval) + 1
  let buckets = []
  for (let i = 0; i < numBuckets; i += 1) {
    buckets.push({
      start: firstTimestamp + (timeInterval * i),
      end: firstTimestamp + (timeInterval * (i + 1)),
      items: []
    })
  }

  dataList.forEach(data => {
    data.forEach(item => {
      const messageTimestamp = timestampRetriever(item);
      let b = 0;
      while (
        buckets[b].end < messageTimestamp
        ) {
        b += 1;
      }
      buckets[b].items.push(item)
    });
  });

  return buckets;
};

export default FacebookApi;
