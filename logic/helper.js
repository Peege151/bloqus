helper = {

	specIndexOf: function(arr, val){
		for(var x = 0 ; x < arr.length; x++){ if(arr[x][0] === val[0] && arr[x][1] === val[1]){return x;}}
		return -1;
	},

	sameArrElements:function(one, two){

		if (one.length != two.length){return false;}
		var thisShape = one.slice();
		var otherShape = two.slice();
		for(var x = 0; x < thisShape.length; x++){
			if(this.specIndexOf(otherShape, thisShape[x]) === -1){return false;}
			if(this.specIndexOf(thisShape, otherShape[x]) === -1){return false;}
		}

		return true;
	},


	deepEquals: function(obj1,obj2){
		var self = this;
        return (Array.isArray(obj1))
                ? obj1.every(function(n,i){return self.deepEquals(obj1[i], obj2[i]);})
                : (obj1 == obj2);
	},

	addLocations: function(one, two){
		return [one[0]+two[0],one[1]+two[1]];
	}

};