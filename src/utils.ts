// 导出一个函数，用于打乱数组
export function shuffle(array: any[]): any[] {
    // 创建原数组的副本
    const shuffledArray = array.slice(); 

    // 从数组的最后一个元素开始，向前遍历
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        // 生成一个0到i之间的随机数
        const j = Math.floor(Math.random() * (i + 1)); 

        // Swap elements at i and j
        // 交换i和j位置的元素
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }

    // 返回打乱后的数组
    return shuffledArray;
}