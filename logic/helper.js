helper = {

	sameArrElements:function(one, two){

		var specIndexOf = function(arr, val){
			for(var x = 0 ; x < arr.length; x++){ if(arr[x][0] === val[0] && arr[x][1] === val[1]){return x;}}
			return -1;
		}

		if (one.length != two.length){return false;}
		var thisShape = one.slice();
		var otherShape = two.slice();
		for(var x = 0; x < thisShape.length; x++){
			if(specIndexOf(otherShape, thisShape[x]) === -1){return false;}
			if(specIndexOf(thisShape, otherShape[x]) === -1){return false;}
		}

		return true;
	},


	deepEquals: function(obj1,obj2){
        return (Array.isArray(obj1))
                ? obj1.every(function(n,i){return deepEquals(obj1[i], obj2[i]);})
                : (obj1 == obj2);
	}

};