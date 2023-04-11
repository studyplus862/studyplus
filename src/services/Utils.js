import { toast } from "react-toastify";

export const createDynamicLink=async (id,sTitle,SDesc,sImage,type)=>{
    // Define the request payload
    const payload = {
        dynamicLinkInfo: {
          domainUriPrefix: "https://studyplus12.page.link",
          link: `https://starcentre.in/other?id=${id}&type=${type}`,
          androidInfo: {
            androidPackageName: "com.studygrown.studyplus"
          },
          socialMetaTagInfo: {
            socialTitle: sTitle,
            socialDescription:SDesc,
            socialImageLink:sImage
        }
        },
        suffix: {
          option: "SHORT"
        }
      };
      
      // Send a POST request to the Firebase API endpoint to create a Dynamic Link
      const response = await fetch("https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBYfAssJvj4uBIAuFZRg89rlYmKpcxyPkA", {
        method: "POST",
        headers: {
          "Authorization": "bearer AIzaSyBYfAssJvj4uBIAuFZRg89rlYmKpcxyPkA",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      // Parse the response JSON and extract the short Dynamic Link
      const json = await response.json();
      const shortLink = json.shortLink;
      
    
      //copy to clipboard
      try {
        await navigator.clipboard.writeText(shortLink);
        toast.success("Link copied to clipboard -"+shortLink);
      } catch (error) {
        toast.error("something went wrong");
      }
}