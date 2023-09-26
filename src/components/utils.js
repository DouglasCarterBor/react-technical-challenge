export function formatDescription(filmTitles) {
    const length = filmTitles.length;
  
    if (length === 0) {
      return '';
    } else if (length === 1) {
      return filmTitles[0] + '.';
    } else {
      const formattedList = filmTitles.reduce((result, title, index) => {
        if (index === length - 1) {
          return result + ' e ' + title + '.';
        } else if (index === length - 2) {
          return result + title;
        } else {
          return result + title + ', ';
        }
      }, '');
  
      return formattedList;
    }
  }
  
  export function addSpacesToEveryThreeCharacters(str) {
   return str.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}