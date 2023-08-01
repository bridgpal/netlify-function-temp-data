

export default async (request: Request, context: any) => {


  const url = new URL(request.url);
  const path = url.pathname; // Get the URL path
  const parts = path.split('/'); // Split the path into parts using the slash '/'
  const lastPart = parts[parts.length - 1];


 const response2 = await fetch(url.origin);
 const page2 = await response2.text()
 console.log("PAGE2", page2);


  // Search for the placeholder
  const regex = /{{RECIPE_IMAGE}}/gi;

  // Replace the content
  const updatedPage = page2.replace(regex, lastPart);
  console.log(updatedPage);
  return new Response(updatedPage, response2);
  
};