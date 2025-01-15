import mongoose from 'mongoose';
if(mongoose.models.llms){
  delete mongoose.models.users
}

const llmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide LLM Name"]
  },
  tokenId: {
    type: String,
    required: [true, "Please provide LLM Token"]
  },
  apiEndpoint: {
    type: String,
    required: false,
    default: undefined
  },

});

const Llm = mongoose.models.llms || mongoose.model("llms", llmSchema);

export default Llm;
