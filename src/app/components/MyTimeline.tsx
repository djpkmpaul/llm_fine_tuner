import {
    Timeline,
    TimelineItem,
    TimelineTitle,
    TimelineDescription,
    TimelineTime,
    TimelineHeader,
  } from '@/components/timeline';
  
  import { TimelineItemType } from '@/types';
  
  const timelineData: TimelineItemType[] = [
    {
      id: 1,
      title: 'Upload Dataset',
      description:
        'Start by uploading your custom dataset in the supported format (e.g., CSV, JSON, or text files). Ensure the data is clean and relevant for fine-tuning.',
      time: 'Step 1',
    },
    {
      id: 2,
      title: 'Preprocess Data',
      description:
        'The platform automatically preprocesses your dataset (e.g., tokenization, cleaning, and formatting) to make it ready for fine-tuning.',
      time: 'Step 2',
    },
    {
      id: 3,
      title: 'Select Base Model',
      description:
        'Choose a pre-trained LLM as the base model for fine-tuning. Options include popular models like GPT, BERT, or other supported architectures.',
      time: 'Step 3',
    },
    {
      id: 4,
      title: 'Configure Fine-Tuning Parameters',
      description:
        'Set fine-tuning parameters such as learning rate, number of epochs, batch size, and method (e.g., LoRA). These settings determine how the model learns.',
      time: 'Step 4',
    },
    {
      id: 5,
      title: 'Start Fine-Tuning',
      description:
        'Begin the fine-tuning process. The platform handles the backend operations, utilizing your provided dataset and configurations.',
      time: 'Step 5',
    },
    {
      id: 6,
      title: 'Monitor Progress',
      description:
        'Track the fine-tuning progress via real-time charts and logs. This provides insights into model performance, loss metrics, and accuracy.',
      time: 'Step 6',
    },
    {
      id: 7,
      title: 'Evaluate Model Performance',
      description:
        'Once fine-tuning is complete, evaluate the performance of the fine-tuned model using test datasets. Check accuracy, precision, recall, or other metrics.',
      time: 'Step 7',
    },
    {
      id: 8,
      title: 'Download or Deploy Model',
      description:
        'Download the fine-tuned model for offline use or deploy it directly via the platform’s APIs for integration into your application.',
      time: 'Step 8',
    },
    {
      id: 9,
      title: 'Manage and Version Control',
      description:
        'Use the platform to manage your fine-tuned models, version control them, and revisit them for further improvements or updates.',
      time: 'Step 9',
    },
  ];
  
  
  export const MyTimeline = () => {
    return (
      <Timeline className='mt-8'>
        {timelineData.map((item) => (
          <TimelineItem key={item.id}>
            <TimelineHeader>
              <TimelineTime>{item.time}</TimelineTime>
              <TimelineTitle>{item.title}</TimelineTitle>
            </TimelineHeader>
            <TimelineDescription>{item.description}</TimelineDescription>
          </TimelineItem>
        ))}
      </Timeline>
    );
  };