class LoadTimeData {
  values: {[key: string]: string} = {

  }

  valueExists(name: string) {
    return name in this.values
  }

  getValue(name: string): string {
    return this.values[name];
  }
}

export const loadTimeData = new LoadTimeData();
