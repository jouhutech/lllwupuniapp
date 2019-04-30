const serviceUrl = 'https://jouhu.com/lllwupapi/public/index.php/jmobile/';  
const newTime = Date.now || function () {  
    return new Date().getTime();  
};  
const isArray = Array.isArray || function (obj) {  
    return obj instanceof Array;  
};  
/**         
 * 时间戳转换日期               
 * @param <int> unixTime    待时间戳(秒)               
 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)               
 * @param <int>  timeZone   时区               
 */
const DateToTime = function (unixTime, isFull, timeZone) {
	if (typeof (timeZone) == 'number'){  
		unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;  
	}  
	var time = new Date(unixTime * 1000);  
	var ymdhis = "";
	ymdhis += time.getFullYear() + "-";  
	ymdhis += (time.getMonth()+1) + "-";  
	ymdhis += time.getDate();  
	if (isFull === true){  
		ymdhis += " " + time.getHours() + ":";  
		ymdhis += time.getMinutes() + ":";  
		ymdhis += time.getSeconds();  
	}
	return ymdhis;
};  

export default {  
    serviceUrl,  
    newTime,  
    isArray,
	DateToTime
}  