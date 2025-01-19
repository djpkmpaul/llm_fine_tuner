import { randomUUID } from "crypto";
import mongoose from 'mongoose';


if (mongoose.models.llms) {
  delete mongoose.models.llms
}

const llmSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide LLM Name"]
  },
  baseModel: {
    type: String,
    required: [true, "Please choose LLM Model"]
  },
  tokenId: {
    type: String,
    required: [true, "Please provide LLM Token"],
    default: randomUUID().toString()
  },
  modelParams: {
    r: {
      type: Number,
      required: [true, "Rank not defined"],
      default: 16
    },
    target_modules: {
      type: [String],
      required: [true, "Traget modules required"],
      default: ['q_proj']
    },
    lora_alpha: {
      type: Number,
      required: [true, "Alpha value not specified"],
      default: 16
    },
    lora_dropout: {
      type: Number,
      required: [true, "Dropout value not specified"],
      default: 0
    },
    bias: {
      type: String,
      required: [true, "Bias ('none' or any other value) not specified"],
      default: "none"
    },
    use_gradient_checkpointing: {
      type: String,
      required: [true, "Bias ('unsloth' or any other value) not specified"],
      default: "unsolth"
    },
    random_state: {
      type: Number,
      required: [true, "Random State required"],
      default: 3407
    },
    use_rslora: {
      type: Boolean,
      required: [true, "Specify Do you want to you use RSLoRA? True of False"],
      default: false
    }
  },
  apiEndpoint: {
    type: String,
    required: false,
    default: undefined
  },
  chats: [{
    type: String,
    content: String
  }]

});

const Llm = mongoose.models.llms || mongoose.model("llms", llmSchema);

export default Llm;
