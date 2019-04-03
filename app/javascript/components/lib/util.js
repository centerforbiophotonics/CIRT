export function characterDiff(string1, string2) {
  let total_diff = 0;

  let short_string = string1;
  let long_string = string2;
  if (string2.length < string1.length){
    short_string = string2;
    long_string = string1;
  } 

  for (let i = 0; i < long_string.length; i++){
    if (i >= short_string.length || long_string[i] !== short_string[i])
      total_diff++;
  }

  return total_diff;
}


export function personCapitalizationProblem(p){
  let name_cap = false;
  p.name.split(" ").forEach(name_part => {
    if (
      name_part[0].toUpperCase() != name_part[0] &&
      !["de", "del", "la"].includes(name_part)
      // ||
      // name_part.slice(1).toLowerCase() != name_part.slice(1)
    ) name_cap = true;
  })

  return (
      (p.email != null && p.email.toLowerCase() !== p.email) || 
      (p.cas_user != null && p.cas_user.toLowerCase() !== p.cas_user) ||
      name_cap
  );
}

export function fixPersonCapitalization(p){

}

export function personWhitespaceProblem(p){

}

export function fixPersonWhitespace(p){

}

export function detectDuplicate(p1, p2, criteria){
  
}
