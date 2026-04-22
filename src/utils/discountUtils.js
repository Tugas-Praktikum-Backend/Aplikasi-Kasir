function checkExpired(data, start, end){
    const discountStart = new Date(data.discountStart * 1000);
    const discountEnd = new Date((data.discountStart + data.discountDuration) * 1000);
    if(!start)start = new Date(Date.now());
    if(!end)end = new Date(Date.now());
    if(discountStart.getTime() > end.getTime() || discountEnd.getTime() < start.getTime()){
        return true;
    }
}

module.exports = { checkExpired };