const SurveyCard = () => {
    return (
        <div className="bg-white px-4 py-5 sm:px-6">
  <div className="flex space-x-3">
    <div className="shrink-0">
      <img className="size-10 rounded-full" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-gray-900">
        <a href="#" className="hover:underline">Chelsea Hagon</a>
      </p>
      <p className="text-sm text-gray-500">
        <a href="#" className="hover:underline">December 9 at 11:43 AM</a>
      </p>
    </div>
    <div className="flex shrink-0 self-center">
      <div className="relative inline-block text-left">
        <div>
          <button type="button" className="-m-2 flex items-center rounded-full p-2 text-gray-400 hover:text-gray-600" id="menu-0-button" aria-expanded="false" aria-haspopup="true">
            <span className="sr-only">Open options</span>
            <svg className="size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
              <path d="M10 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM10 8.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11.5 15.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  </div>
</div>

    )
}

export default SurveyCard;