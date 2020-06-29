import FacebookApi from './api';

class AdsAndBusinessesApi extends FacebookApi {
  constructor() {
    super();
    try {
      const dir = `${super.getRoot()}/ads_and_businesses`;
      const offFacebook = `${dir}/your_off-facebook_activity.json`;
      this.offFacebook = {};

      const businessesMap = {};
      this.readFacebookJson(offFacebook).off_facebook_activity
        .map(company => ({
          name: super.fixEncoding(company.name),
          events: company.events,
          eventTypeCount: countEventType(company.events)
        }))
        .forEach((company) => {
          // Dedupe by name
          if(company.name in businessesMap) {
            businessesMap[company.name].events = company.events.concat(businessesMap[company.name].events);
          } else {
            businessesMap[company.name] = company;
          }
        });
      this.offFacebook.businesses = Object.values(businessesMap);
      this.offFacebook.businesses.sort((a, b) => b.events.length - a.events.length);

      this.offFacebook.types = this.offFacebook.businesses.reduce((result, next) => {
        const toReturn = result;
        Object.entries(next.eventTypeCount).forEach((entry) => {
          const [type, count] = entry;
          if (!(type in toReturn)) {
            toReturn[type] = 0;
          }
          toReturn[type] += count;
        });
        return toReturn;
      }, {});

      const allTimestamps = this.offFacebook.businesses.flatMap(
        business => business.events
      ).map(event => event.timestamp);
      allTimestamps.sort((a,b) => a-b);

      this.offFacebook.timestampRange = {
        start: allTimestamps[0],
        end: allTimestamps[allTimestamps.length - 1]
      };

      this.loaded = true;
    } catch (e) {
      console.log("couldn't load ads and businesses api", e);
      this.loaded = false;
    }
  }
}

const countEventType = events => {
  const types = {};
  events.forEach(event => {
    if (!(event.type in types)) {
      types[event.type] = 0;
    }
    types[event.type] += 1;
  });
  return types;
};


export default AdsAndBusinessesApi;
