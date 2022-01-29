async function getData(file, filter){
  try{
  return await fetch("https://replverse-data.ironcladdev.repl.co/json/" + file, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept": "*/*"
    },
    body: JSON.stringify(filter)
  }).then(r => r.json())
  }catch(e){
    console.log(e)
    return [];
  }
}

export {getData}