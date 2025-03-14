/**
 * Processes API response data into a usable format
 */
export const processApiResponse = (result: any): any[] => {
  let data: any[] = [];
  
  if (Array.isArray(result)) {
    data = result;
  } else if (result.data && Array.isArray(result.data)) {
    data = result.data;
  } else if (typeof result === 'object') {
    const arrayCandidate = Object.values(result).find(val => Array.isArray(val));
    if (arrayCandidate && Array.isArray(arrayCandidate)) {
      data = arrayCandidate;
    } else {
      data = [result];
    }
  }
  
  return data;
};