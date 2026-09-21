import AppLoading from "@/components/common/app-loading"

const Loading = () => {
   return (
      <AppLoading
         message="Loading Data..."
         size={5}
         className="min-h-[calc(100vh-8.5rem)]"
      />
   )
}

export default Loading