Array.prototype.forEach.call(document.body.querySelectorAll("*[data-mask]"), applyDataMask);

function applyDataMask(field) {
    var mask = field.dataset.mask.split('');
    
    function stripMask(maskedData) {
        function isDigit(char) {
            return /\d/.test(char);
        }
        return maskedData.split('').filter(isDigit);
    }
    
    function applyMask(data) {
        var result = []
        for(var i = 0;i < mask.length; i++){
            var char = mask[i]
            if (char != '_') {
                result.push(char);
                continue;
            }
    
            if (data.length == 0) {
                result.push(char);
                continue;
            }           
            result.push(data.shift());
        }
        return result.join('');
    }
    
    function reapplyMask(data) {
        return applyMask(stripMask(data));
    }
    
    function changed() {   
        var oldStart = field.selectionStart;
        var oldEnd = field.selectionEnd;
        field.value = reapplyMask(field.value);
        
        field.selectionStart = oldStart;
        field.selectionEnd = oldEnd;
    }
    
    field.addEventListener('click', changed)
    field.addEventListener('keyup', changed)
}