import FacebookApi from "./api";

class AdsAndBusinessesApi extends FacebookApi {
  constructor() {
    super();
    try {
      const dir = `${super.getRoot()}/ads_and_businesses`;
      const offFacebook = `${dir}/your_off-facebook_activity.json`;
      this.offFacebook = this.readFacebookJson(offFacebook).off_facebook_activity
        .map(company => ({
          name: super.fixEncoding(company.name),
          events: company.events
        }));
      this.offFacebook.sort((a, b) => b.events.length - a.events.length)
      this.loaded = true;

      console.log(this.offFacebook)
    } catch (e) {
      console.log("couldn't load ads and businesses api", e);
      this.loaded = false;
    }
  }
}

export default AdsAndBusinessesApi;
