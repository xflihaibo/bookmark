import { LockModalProps } from "@/types";

export const LockModal: React.FC<LockModalProps> = ({
  isDark,
  selectedMenuItem,
  passwordInput,
  confirmPasswordInput,
  setPasswordInput,
  setConfirmPasswordInput,
  saveLockPassword,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${isDark ? "bg-gray-800" : "bg-white"}`}>
        <div className={`p-5 flex justify-between items-center border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"} flex items-center gap-2`}>
            <i className="fas fa-lock"></i>锁定菜单
          </h2>
          <button
            onClick={onClose}
            className={`text-xl ${isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-800"}`}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="p-5">
          <p className={`mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            为"{selectedMenuItem?.label}"设置锁定密码：
          </p>
          <div className="mb-4">
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="设置密码"
              className={`w-full border rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`}
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={confirmPasswordInput}
              onChange={e => setConfirmPasswordInput(e.target.value)}
              placeholder="确认密码"
              className={`w-full border rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 ${isDark ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500" : "bg-white border-gray-300 text-gray-800 focus:ring-blue-300"}`}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`py-2 px-6 rounded-lg transition-colors ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>
              取消
            </button>
            <button
              onClick={saveLockPassword}
              className={`py-2 px-6 rounded-lg transition-colors ${isDark ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}>
              确认
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};