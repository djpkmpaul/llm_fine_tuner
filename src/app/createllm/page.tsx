"use client"
import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { HeroHighlight } from '@/components/ui/hero-highlight'
import { AnimatePresence, motion } from 'framer-motion'
import { RocketIllustration, BrainIllustration } from '@/app/components/Illustrations'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NumberInput, SelectInput, MultiSelectInput, BooleanInput } from '@/app/components/ModelParamInput'
import axios from 'axios'
import { useMySession } from '@/app/helper/MySessionContext'
import MyDialogComponent from '../components/DialogComponent'

type body = {
  name: string,
  description: string,
  defaultValue: string | number | Array<string> | Boolean,
  otherValues: string | number,
}

type ModelParams = {
  r: number,
  target_modules: string[],
  lora_alpha: number,
  lora_dropout: number,
  bias: string,
  use_gradient_checkpointing: string,
  random_state: number,
  use_rslora: boolean
}

type TrainingArg = {
  per_device_train_batch_size: number,
  gradient_accumulation_steps: number,
  warmup_steps: number,
  max_steps: number,
  learning_rate: number,
  logging_steps: number,
  optim: string, // adamw_8bit
  weight_decay: number,
  lr_scheduler_type: string, //"linear"
  seed: number, // random_number
  output_dir: string,
  report_to: string, // none
}

type userSessionDetailsType = {
  username: string,
  email: string
}
type createLLMDataType = {
  llmName: string,
  baseModel: string,
  description: string,
  modelParams: ModelParams,
  trainingArguments: TrainingArg,
  inputColValue: string,
  targetColValue: string,
  userSessionDetails: userSessionDetailsType
}

export default function CreateNewLLM() {
  const router = useRouter();
  const [llmName, setLlmName] = useState("");
  const [llmNameError, setLlmNameError] = useState<string[]>([])
  const [baseModel, setBaseModel] = useState("");
  const [formData, setFormData] = useState<FormData>(new FormData());
  const [showDevOptions, setShowDevOptions] = useState(false)
  const { userSessionDetails, setUserSessionDetails, sessionLoaded, setSessionLoaded } = useMySession();

  const [description, setDescription] = useState<string>("");

  const [inputColValue, setInputColValue] = useState<string>(""); // input column, target
  const [targetColValue, setTargetColValue] = useState<string>(""); // input column, target

  // user cant click submit multiple times. user must wait until the LLM server responds 
  const [canSubmit, setCanSubmit] = useState<Boolean>(true);

  // AWS Polling Variables
  const [status, setStatus] = useState(false);
  const [timeoutTime, setTimeoutTime] = useState<number>(15000); // 3 mins
  const [timelapsed, setTimelapsed] = useState<number>(0);

  const [modelParams, setModelParams] = useState<ModelParams>({
    r: 16,
    target_modules: ['q_proj'],
    lora_alpha: 16,
    lora_dropout: 0,
    bias: "none",
    use_gradient_checkpointing: "unsloth",
    random_state: 3407,
    use_rslora: false
  })

  const [trainingArguments, setTrainingArguments] = useState<TrainingArg>({
    per_device_train_batch_size: 2,
    gradient_accumulation_steps: 4,
    warmup_steps: 5,
    max_steps: 200,
    learning_rate: 2e-4,
    logging_steps: 10,
    optim: "adamw_8bit",
    weight_decay: 0.01,
    lr_scheduler_type: "linear",
    seed: 3407,
    output_dir: "outputs",
    report_to: "none",
  })
  const [createLLMData, setCreateLLMData] = useState<createLLMDataType>({
    llmName: llmName,
    baseModel: baseModel,
    description: description,
    modelParams: modelParams,
    trainingArguments: trainingArguments,
    inputColValue: inputColValue,
    targetColValue: targetColValue,
    userSessionDetails: userSessionDetails
  });
  const advanceOptionStyles = `
  developer-options 
  transition-all 
  duration-500 
  ease-in-out 
  ${showDevOptions ?
      "flex w-[100%] scale-100 h-auto p-2" :
      "w-0 h-0 scale-0 overflow-clip"} 
  border-t-4 
  flex-wrap 
  flex-1 
  justify-around 
  mt-2
`;
  const dialogBody: Array<body> = [
    {
      name: "r",
      description: "Rank used for matrix factorization in LoRA (Low-Rank Adaptation). Affects computation and approximation accuracy.",
      defaultValue: 16,
      otherValues: "Any positive integer"
    },
    {
      name: "target_modules",
      description: "Layers/modules to which LoRA is applied. Allows fine-grained control over adaptation.",
      defaultValue: 'q_proj',
      otherValues: "Array of module names (e.g., ['k_proj', 'v_proj'])"
    },
    {
      name: "lora_alpha",
      description: "Scaling factor for LoRA updates. Controls the influence of updates on weights.",
      defaultValue: 16,
      otherValues: "Positive integer"
    },
    {
      name: "lora_dropout",
      description: "Dropout rate for LoRA layers. Prevents overfitting by randomly dropping updates.",
      defaultValue: 0,
      otherValues: "0 to 1 (fraction)"
    },
    {
      name: "bias",
      description: "Specifies whether to adapt bias terms in the model.",
      defaultValue: "none",
      otherValues: "'all', 'none', or specific bias types"
    },
    {
      name: "use_gradient_checkpointing",
      description: "Enables gradient checkpointing for memory efficiency at the cost of additional compute.",
      defaultValue: "unsloth",
      otherValues: "'sloth' or other gradient strategies"
    },
    {
      name: "random_state",
      description: "Seed for reproducibility. Ensures deterministic training.",
      defaultValue: 3407,
      otherValues: "Any positive integer"
    },
    {
      name: "use_rslora",
      description: "Enables RSLoRA (specialized structured updates).",
      defaultValue: false,
      otherValues: "true/false"
    },
    {
      name: "per_device_train_batch_size",
      description: "Number of training samples processed per device at each step.",
      defaultValue: 2,
      otherValues: "Positive integer"
    },
    {
      name: "gradient_accumulation_steps",
      description: "Number of steps to accumulate gradients before updating weights.",
      defaultValue: 4,
      otherValues: "Positive integer"
    },
    {
      name: "warmup_steps",
      description: "Steps to gradually increase learning rate at the beginning of training.",
      defaultValue: 5,
      otherValues: "Positive integer"
    },
    {
      name: "max_steps",
      description: "Maximum training steps before stopping.",
      defaultValue: 200,
      otherValues: "Positive integer"
    },
    {
      name: "learning_rate",
      description: "Step size for weight updates during training.",
      defaultValue: 2e-4,
      otherValues: "Positive float (e.g., 1e-3, 5e-4)"
    },
    {
      name: "logging_steps",
      description: "Frequency of logging training progress.",
      defaultValue: 10,
      otherValues: "Positive integer"
    },
    {
      name: "optim",
      description: "Optimizer used for training.",
      defaultValue: "adamw_8bit",
      otherValues: "'adam', 'adamw', etc."
    },
    {
      name: "weight_decay",
      description: "Regularization to prevent overfitting by penalizing large weights.",
      defaultValue: 0.01,
      otherValues: "Float between 0 and 1"
    },
    {
      name: "lr_scheduler_type",
      description: "Strategy for learning rate scheduling.",
      defaultValue: "linear",
      otherValues: "'cosine', 'polynomial', etc."
    },
    {
      name: "seed",
      description: "Seed value for reproducibility.",
      defaultValue: 3407,
      otherValues: "Any positive integer"
    },
    {
      name: "output_dir",
      description: "Directory for saving training results.",
      defaultValue: "outputs",
      otherValues: "Any valid directory path"
    },
    {
      name: "report_to",
      description: "Specifies where training logs/metrics are reported.",
      defaultValue: "none",
      otherValues: "'wandb', 'tensorboard', etc."
    }
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCanSubmit(false)
    if (!llmName || !baseModel) {
      toast.error("Please fill in all fields");
      setCanSubmit(true)
      return
    }
    if (llmNameError.length > 0) {
      // toast.error(llmNameError);
      setCanSubmit(true)
      return;
    }
    toast.success(`Creating your Custom LLM!\n${llmName} : ${baseModel}`);
    console.log("making post request to - ", process.env.AWS_PUBLIC_IP);
    try {
      const awsResponse = await axios.post(`${process.env.AWS_PUBLIC_IP}/file-upload`, formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(awsResponse);
      toast.success(`File Uploaded Successfully. ${awsResponse}`)

      const myData: createLLMDataType = {
        llmName: llmName,
        baseModel: baseModel,
        description: description,
        modelParams: modelParams,
        trainingArguments: trainingArguments,
        inputColValue: inputColValue,
        targetColValue: targetColValue,
        userSessionDetails
      }
      console.log("myData", myData);

      setCreateLLMData(myData);
      // Makes Request to AWS
      const response = await axios.post('api/llms/createllm', myData,
        { timeout: 1800000 } // 30 minutes
      );
      console.log(response);
      console.log(response.data);
      toast.success(response.data.message)
    } catch (error: any) {
      setCanSubmit(true);
      console.log(error);
      toast.error("ERROR: " + error.response)
    }
    return;
  }
  useEffect(() => {
    //TODO: when the status changes from FALSE -> TRUE.  
    //TODO: Run this useEffect to save the model to database
    if (status === true) {
      if (createLLMData) {
        console.log("Saving the model data - ", createLLMData);
        console.log("Usersession details  - ", createLLMData.userSessionDetails.username);
        axios.post('/api/llms/save-llm-model', createLLMData)
          .then((response) => {

            console.log("model saved successfully...", response.data);
            toast.success(response.data.message);
            setCanSubmit(true);
            router.push('/dashboard');
            setCanSubmit(true);
            return;
          }).catch(((error: any) => {
            setCanSubmit(true);
            console.log("Some Error Occurred");
            toast.error(error.response.data.error);
          }))
      }
    }
  }, [status])

  // TODO: Make request to aws server checking for status..
  useEffect(() => {
    console.log("CreateLLMData - ", createLLMData);
    const interval = setInterval(async () => {
      console.log("Time Lapsed - ", timelapsed);

      if (timelapsed > 12 * 60000) {
        console.log("It has been 12 mins, I will be polling every 1 min from now");
        setTimeoutTime(60000);
      }

      console.log("Status - ", status);
      if (status === false) {
        console.log("Checking Fine-Tuning Status..");
        console.log("CreateLLMData Inside - ", createLLMData);
        console.log("UserSession details Inside  - ", createLLMData?.userSessionDetails);

        try {
          const response = await axios.get(`${process.env.AWS_PUBLIC_IP}/status`);
          console.log("Fine-tuning status - ", response.data);
          setStatus(response.data.finished);
        } catch (error) {
          console.error("Error checking fine-tuning status:", error);
        }
      }

      setTimelapsed((prev) => {
        console.log(`timeout ${timeoutTime}ms`);
        return prev + timeoutTime;
      });

    }, timeoutTime);

    return () => clearInterval(interval);
  }, [createLLMData, status, timeoutTime, timelapsed]);  // 👈 Add dependencies here

  useEffect(() => {
    console.log("CreateLLM Data changed");
    console.log("new data - ", createLLMData);

  }, [createLLMData])
  useEffect(() => {
    if (sessionLoaded) {
      console.log("Session successfully Loaded");
      const myUsername = userSessionDetails.username
      const myEmail = userSessionDetails.email
      console.log(myUsername, myEmail);

      setCreateLLMData(
        {
          llmName: llmName,
          baseModel: baseModel,
          description: description,
          modelParams: modelParams,
          trainingArguments: trainingArguments,
          inputColValue: inputColValue,
          targetColValue: targetColValue,
          userSessionDetails: {
            username: myUsername,
            email: myEmail
          }
        }
      )
    }
  }, [sessionLoaded])
  useEffect(() => {
    console.log("Session loaded...");
    const myUsername = userSessionDetails.username
    const myEmail = userSessionDetails.email
    console.log(myUsername);
    console.log(myEmail);

  }, [sessionLoaded])
  const fourbit_models = [
    "unsloth/Meta-Llama-3.1-8B-bnb-4bit",
    "unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit",
    "unsloth/Meta-Llama-3.1-70B-bnb-4bit",
    "unsloth/Mistral-Nemo-Base-2407-bnb-4bit",
    "unsloth/Mistral-Nemo-Instruct-2407-bnb-4bit",
    "unsloth/mistral-7b-v0.3-bnb-4bit",
    "unsloth/mistral-7b-instruct-v0.3-bnb-4bit",
    "unsloth/Phi-3.5-mini-instruct",
    "unsloth/Phi-3-medium-4k-instruct",
  ]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay: .5, type: "spring", bounce: 0.52 }}
      className="h-[100vh] bg-gradient-to-b from-gray-50 to-white"
    >
      <HeroHighlight>
        <AnimatePresence>

          <div
            className={`transition-all duration-500 ease-in-out flex flex-col items-center px-4 py-12 ${showDevOptions ? "w-screen" : "w-[100%]"}`}
          >
            <Toaster />
            <motion.main
              className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <div className="flex justify-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.1, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <RocketIllustration />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <BrainIllustration />
                </motion.div>
              </div>
              <motion.h2
                className="text-4xl font-mono font-extrabold text-center text-gray-800 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                Create Your Custom LLM
              </motion.h2>
              <motion.form
                initial={{ y: 1000 }}
                animate={{ y: 0 }}
                exit={{ y: 1000 }}
                transition={{ delay: 1.5, type: "spring", bounce: 0.1 }}
                onSubmit={handleSubmit} className="space-y-6"
              >
                <div className={`${canSubmit ? "hidden" : "flex"}`}>
                  <h2 className={`text-md p-1 text-muted-foreground font-mono font-extrabold ${status ? "text-green-400" : "text-red-400"}`}>
                    Fine-Tuning Status:
                  </h2>
                  <p className={`text-md p-1 font-mono font-extrabold text-muted-foreground ${status ? "text-green-400" : "text-red-400"}`}>{status ? "✅ Fine-tuning Completed!" : "⏳ Fine-tuning in Progress..."}</p>
                </div>
                <div>
                  <Label htmlFor="llmName" className="text-lg font-medium text-gray-700">LLM Name</Label>
                  <Input
                    id="llmName"
                    name="llmName"
                    type="text"
                    value={llmName}
                    required
                    className="mt-1 block w-full text-lg py-3 px-4"
                    placeholder="Enter a name for your LLM"
                    onChange={(e: any) => {
                      console.log("Value changed...");

                      const value = e.target.value;
                      if (!/^[a-zA-Z0-9_]*$/.test(value)) {
                        setLlmNameError(prev => ["Use underscores '_'  instead."]);
                      } else {
                        setLlmNameError([]); // Clear error if valid
                      }
                      setLlmName(e.target.value)
                      value && (
                        axios
                          .get(`/api/llms/helper/check-if-llm-exists?name=${value}`)
                          .then((response) => {
                            console.log("response - ", response.data.exists);
                            const llmNameTaken = response.data.exists;
                            const nameTakenError = `The LLM name "${value}" is already taken, try a difference one`
                            console.log("nameTakenError - ", nameTakenError);
                            llmNameTaken && setLlmNameError(prev => [...prev, nameTakenError])
                          })
                          .catch((error) => {
                            console.log(`check-if-llm-exists : ERROR ${error.message}`);
                          })

                      )
                      console.log("LLM NAME ERROR - " , llmNameError);
                    }}
                  />
                  <p className='text-sm p-1 text-muted-foreground '>the llm name should not have space. <code>example: my_llm_name</code></p>
                  {
                    // if the llm name exist only then validate
                    llmName && (
                      llmNameError.length > 0 ?
                        llmNameError.map((err, idx) => <p className="text-xs p-1 text-muted-foreground text-red-400">❌ {idx + 1}. {err}</p>)
                        :
                        <p className="text-xs p-1 text-muted-foreground text-green-500">Correct ✅✅✅</p>
                    )
                  }
                </div>
                <div>
                  <Label htmlFor="baseModel" className="text-lg font-medium text-gray-700">Base Model</Label>
                  <Select value={baseModel} onValueChange={setBaseModel} required>
                    <SelectTrigger className="w-full text-lg py-3">
                      <SelectValue placeholder="Select a base model" />
                    </SelectTrigger>
                    <SelectContent>
                      {fourbit_models.map((model, idx) => {
                        let modelName = model.split('/')[1]
                        modelName = modelName.split('-bnb-4bit')[0]
                        return <SelectItem key={idx} value={`${model}`}>{modelName}</SelectItem>
                      })}
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dataset" className="text-lg font-medium text-gray-700">Upload Dataset</Label>
                  <Input
                    id="dataset"
                    name="dataset"
                    type="file"
                    accept='.jsonl'
                    required
                    className="mt-1 block w-full text-lg py-3 px-4 cursor-pointer"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        const fileFormData = new FormData();
                        Object.values(e.target.files).forEach((file) => {
                          fileFormData.append("file", file)
                        })
                        setFormData(fileFormData);
                      }
                    }}
                  />
                  <p className={`text-sm p-1 text-muted-foreground ${formData ? "w-[100%]" : "w-[30em]"}`}>Note: We allow only <code className='text-zinc-600 bg-slate-200'>.jsonl</code> format files</p>
                </div>
                <div>

                </div>
                <div id="columns" className="columns">
                  <Label htmlFor="columns" className="text-lg font-medium text-gray-700">
                    Dataset Columns
                  </Label>
                  <p className={`text-sm text-muted-foreground text-wrap p-1 ${showDevOptions ? "w-[100%]" : "w-[30em]"}`}>
                    Categorise the columns/features in your dataset into <code className='text-zinc-600 bg-slate-200'>input or target.</code>
                  </p>
                  <div className={`flex flex-wrap ${showDevOptions ? "w-[100%]" : "w-[30em]"}`}>

                    <div className='flex border-[1px] my-2 mx-2'>
                      <SelectInput
                        className="w-[40%]"
                        label="Input Attribute"
                        value={"Input Column"}
                        onChange={(value) => {
                        }}
                        options={["Input Column"]}
                      />
                      <div className="inp m-2 p-2">
                        <Label>Column Name</Label>
                        <Input
                          name={`inputColumnName`}
                          type="text"
                          value={inputColValue}
                          required
                          className="my-2 py-2 space-y-2 w-[100%] text-lg"
                          placeholder="Column name"
                          onChange={(e: any) => {
                            // Add logic to handle column name changes if needed
                            setInputColValue(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                    <div className='flex border-[1px] my-2 mx-2'>
                      <SelectInput
                        className="w-[40%]"
                        label="Input Attribute"
                        value={"Target Column"}
                        onChange={(value) => {
                        }}
                        options={["Target Column"]}
                      />
                      <div className="inp m-2 p-2">
                        <Label>Column Name</Label>
                        <Input
                          name={`inputColumnName`}
                          type="text"
                          value={targetColValue}
                          required
                          className="my-2 py-2 space-y-2 w-[100%] text-lg"
                          placeholder="Column name"
                          onChange={(e: any) => {
                            // Add logic to handle column name changes if needed
                            setTargetColValue(e.target.value)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor='description' className='text-lg font-medium text-gray-700'>Explain the Purpose</Label>
                  <Textarea
                    id='description'
                    placeholder="Tell us a little bit about dataset."
                    className="resize-none"
                    value={description}
                    onChange={(e: any) => { setDescription(e.target.value) }}
                  />
                  <p className={`text-sm text-muted-foreground text-wrap p-1 ${showDevOptions ? "w-[100%]" : "w-[30em]"}`}>Please take a moment and provide us the purpose for fine-tuning this LLM. <b>(Try to be Descriptive.)</b></p>
                </div>
                <div>
                  <Button variant={"outline"} type="button" className='mt-3 font-medium text-slate-500' onClick={() => setShowDevOptions(curr => !curr)}>
                    {showDevOptions ? "Hide Advanced Options" : "Show Advanced Options"}
                  </Button>

                  {showDevOptions && <MyDialogComponent
                    title='Advance Options'
                    trigger='Learn More'
                    description='Learn about the advance option used in Fine Tuning of LLMs'
                    body={dialogBody}
                  />}


                  {showDevOptions && <Label className='text-lg font-medium text-gray-700 mt-3 block'>PEFT Model Parameters</Label>}
                  <div
                    className={advanceOptionStyles}
                  >

                    <SelectInput
                      label="Rank (r)"
                      value={modelParams.r}
                      onChange={(value: any) => setModelParams({ ...modelParams, r: parseInt(value) })}
                      options={["2", "4", "16"]}
                    />
                    <MultiSelectInput
                      label="Target Modules"
                      values={modelParams.target_modules}
                      onChange={(values: any) => setModelParams({ ...modelParams, target_modules: values })}
                      options={["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]}
                    />
                    <SelectInput
                      label="LoRA Alpha"
                      value={modelParams.lora_alpha}
                      onChange={(value: any) => setModelParams({ ...modelParams, lora_alpha: value })}
                      options={["2", "4", "16"]}
                    />
                    <NumberInput
                      label="LoRA Dropout"
                      value={modelParams.lora_dropout}
                      onChange={(value: any) => setModelParams({ ...modelParams, lora_dropout: value })}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                    <SelectInput
                      label="Bias"
                      value={modelParams.bias}
                      onChange={(value: any) => setModelParams({ ...modelParams, bias: value })}
                      options={["none", "partial", "full"]}
                    />
                    <SelectInput
                      label="Use Gradient Checkpointing"
                      value={modelParams.use_gradient_checkpointing}
                      onChange={(value: any) => setModelParams({ ...modelParams, use_gradient_checkpointing: value })}
                      options={["unsloth", "adam"]}
                    />
                    <NumberInput
                      label="Random State"
                      value={modelParams.random_state}
                      onChange={(value: any) => setModelParams({ ...modelParams, random_state: value })}
                      min={1}
                      max={10000}
                    />
                    <BooleanInput
                      label="Use RSLoRA"
                      value={modelParams.use_rslora}
                      onChange={(value: any) => setModelParams({ ...modelParams, use_rslora: value })}
                    />
                  </div>

                  {showDevOptions && <Label className='text-lg font-medium text-gray-700 mt-3 block'>Training Arguments</Label>}
                  <div className={advanceOptionStyles}>
                    <NumberInput
                      label="Training Batch per Device"
                      value={trainingArguments.per_device_train_batch_size}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, per_device_train_batch_size: parseInt(value) })}
                      min={2}
                      max={32}
                      step={1}
                    />
                    <NumberInput
                      label="Gradient Accumulation Steps"
                      value={trainingArguments.gradient_accumulation_steps}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, gradient_accumulation_steps: parseInt(value) })}
                      min={4}
                      max={32}
                      step={1}
                    />
                    <NumberInput
                      label="Warm Up Steps"
                      value={trainingArguments.warmup_steps}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, warmup_steps: parseInt(value) })}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <NumberInput
                      label="Max Steps"
                      value={trainingArguments.max_steps}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, max_steps: parseInt(value) })}
                      min={100}
                      max={700}
                      step={1}
                    />
                    <NumberInput
                      label="Learning Rate"
                      value={trainingArguments.learning_rate}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, learning_rate: parseFloat(value) })}
                      min={0.0002}
                      max={0.1}
                      step={0.001}
                    />
                    <NumberInput
                      label="Loggin Steps"
                      value={trainingArguments.logging_steps}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, logging_steps: parseInt(value) })}
                      min={5}
                      max={100}
                      step={5}
                    />
                    <SelectInput
                      label="Optimiser"
                      value={trainingArguments.optim}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, optim: value })}
                      options={["adamw_8bit"]}
                    />
                    <NumberInput
                      label="Weight Decay"
                      value={trainingArguments.weight_decay}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, weight_decay: parseFloat(value) })}
                      min={0.01}
                      max={1}
                      step={0.01}
                    />
                    <SelectInput
                      label="LR Scheduler Type"
                      value={trainingArguments.lr_scheduler_type}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, lr_scheduler_type: value })}
                      options={["linear"]}
                    />
                    <NumberInput
                      label="Seed"
                      value={trainingArguments.seed}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, seed: parseInt(value) })}
                      min={1}
                      max={10000}
                      step={1}
                    />
                    <div className="w-[30%]">
                      <Label htmlFor="outdirName" className="text-base font-medium text-gray-700">Output Directory Name</Label>
                      <Input
                        id="outdirName"
                        name="outdirName"
                        type="text"
                        value={trainingArguments.output_dir}
                        required
                        className="mt-1 text-lg py-3 px-4"
                        placeholder="Output Directory name"
                        onChange={(e) => setTrainingArguments({ ...trainingArguments, output_dir: e.target.value.split(' ').join('_').toString() })}
                      />
                    </div>
                    <SelectInput
                      label="Report to?"
                      value={trainingArguments.report_to}
                      onChange={(value: any) => setTrainingArguments({ ...trainingArguments, report_to: value })}
                      options={["none"]}
                    />
                  </div>
                </div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1, transition: { delay: 2.0, type: "spring", bounce: 0.52 } }}
                  exit={{ scaleX: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: .1, type: "spring", bounce: 0.1 }}

                >
                  <Button type='submit' className='w-full text-lg py-6'>
                    Create Your LLM
                  </Button>

                  {/* {
                    canSubmit ?
                      <Button type='submit' className='w-full text-lg py-6'>
                        Create Your LLM
                      </Button>
                      :
                      <Button type='button' variant="ghost" className='w-full text-sm py-6'>
                        Please wait we're processing your request..
                      </Button>
                  } */}
                  {/* <Button type='submit' className='w-full text-lg py-6'>
                  Create Your LLM
                </Button> */}
                </motion.div>
              </motion.form>
            </motion.main>
          </div>
        </AnimatePresence>
      </HeroHighlight>
    </motion.div>
  )
}

