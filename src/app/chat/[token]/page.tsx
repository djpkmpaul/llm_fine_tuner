import React from 'react'

export default async function ChatPage({params}:{params: { token: string }} ) {
  const {token} = await params;
    return (
    <div>Chat with {token} LLM</div>
  )
}
