console.log(' 我是插件 src/pages/background/index.js 的内容');
/* eslint-disable no-undef */
// 响应消息处理器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('收到消息请求:', request.action);
    
    // 处理获取书签请求
    if (request.action === 'GET_BOOKMARKS') {
        console.log('处理GET_BOOKMARKS请求...');
        
        // 获取完整书签树
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            try {
                console.log('成功获取书签树');
                
                // 书签树的根是一个数组，通常第一个元素就是整个书签的根
                if (bookmarkTreeNodes && bookmarkTreeNodes.length > 0) {
                    const root = bookmarkTreeNodes[0];
                    console.log('书签树根节点:', root.children[0]);
                    
                    // 发送书签数据给请求方
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: true,
                        payload: root.children[0]
                    });

                    chrome.runtime.sendMessage({
                        type: 'BOOKMARKS',
                        payload: root.children[0]
                    });
                    
                } else {
                    console.error('书签树为空');
                    sendResponse({
                        type: 'BOOKMARKS',
                        success: false,
                        error: '书签树为空'
                    });
                }
            } catch (error) {
                console.error('处理书签数据时出错:', error);
                sendResponse({
                    type: 'BOOKMARKS',
                    success: false,
                    error: error.message
                });
            }
        });
        
        // 告诉Chrome我们将异步回复
        return true;
    }
    
    return false;
});

console.log('Background script 初始化完成，等待消息请求...');
