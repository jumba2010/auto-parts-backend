const { marshall } = require("@aws-sdk/util-dynamodb");

const composeUdateFields=(payload)=>{
    let expressionAttributeNames={}
  let expressionAttributeValues={};
  let updateExpression="";
  
  for (const key in payload) {
    let expression=':'+key;
    let expressionEscape='#'+key;
    let value=payload[key];
    let valueType=getValueType(value);

    /*When Sending Data as Number to DynamoDB whe need to send them in String formated way like in the example below:
    Ex. {
    ':model': { S: 'KML5' },  // String attribute
    ':rating': { N: '4.5' }   // Number attribute (represented as a string)
    */
    if(valueType=='N')value=''+value

    //For any other DataTypes, We need to send them in a formated way
    if(valueType=='M' || valueType=='L' ) value=marshall(value)

    expressionAttributeValues[expression] = {
        [valueType]: value,
    };
    expressionAttributeNames[expressionEscape]=key;
  
    if(updateExpression==""){
        updateExpression='SET #' +key+ ' = '+expression
    }
    else{
        updateExpression=updateExpression+',#'+key+' = '+expression
    }
  
  }
  
  return {expressionAttributeNames,expressionAttributeValues,updateExpression}
  }
  
  function getValueType(value) {
    if (Array.isArray(value)) {
      return 'L';//List
    } else if (typeof value === 'number' && isFinite(value)) {
      return 'N'; // Number
    } else if (typeof value === 'string' || value instanceof String) {
      return 'S'; // String
    } else if (typeof value === 'object' && value !== null) {
      return 'M'; // Object (Map)
    } else {
      return 'UNKNOWN'; // Unknown type
    }
  }

  
  module.exports={
    composeUdateFields
  }